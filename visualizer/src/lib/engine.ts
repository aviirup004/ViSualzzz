// @babel/standalone is dynamically imported below to optimize bundle size!

export interface StackItem {
    id: string;
    name: string;
    location?: string;
}

export interface WebApiItem {
    id: string;
    name: string;
    type: string;
}

export interface QueueItem {
    id: string;
    name: string;
    source: string;
    __execute?: () => void;
}

export interface MemoryNode {
    id: string;
    label: string;
    type: string;
    isRetained: boolean;
}

export interface MemoryEdge {
    source: string;
    target: string;
    label: string;
}

export interface MemoryHeap {
    nodes: MemoryNode[];
    edges: MemoryEdge[];
    metrics: { total: number; used: number; }
}

export interface EngineStateSnapshot {
    callStack: StackItem[];
    webApis: WebApiItem[];
    microtaskQueue: QueueItem[];
    macrotaskQueue: QueueItem[];
    nextTickQueue: QueueItem[];
    checkQueue: QueueItem[];
    memoryHeap: MemoryHeap;
    consoleOutput: string[];
    activeLine?: number;
}

export async function generateExecutionSteps(code: string): Promise<EngineStateSnapshot[]> {
    const steps: EngineStateSnapshot[] = [];

    let currentCallStack: StackItem[] = [{ id: 'cs-global', name: 'Anonymous (global)', location: 'main.js:1' }];
    let currentWebApis: WebApiItem[] = [];
    let currentMicrotasks: QueueItem[] = [];
    let currentMacrotasks: QueueItem[] = [];
    let currentNextTick: QueueItem[] = [];
    let currentCheck: QueueItem[] = [];
    let currentMemoryNodes: MemoryNode[] = [];
    let currentMemoryEdges: MemoryEdge[] = [];
    let currentConsole: string[] = [];
    let currentActiveLine: number | undefined = undefined;

    const capture = () => {
        const activeSources = new Set(['cs-global', ...currentCallStack.map(s => s.id)]);
        const reachableNodes = new Set<string>();

        const traverse = (source: string) => {
            currentMemoryEdges.filter(e => e.source === source).forEach(e => {
                if (!reachableNodes.has(e.target)) {
                    reachableNodes.add(e.target);
                    traverse(e.target);
                }
            });
        };
        activeSources.forEach(traverse);

        currentMemoryNodes.forEach(n => {
            n.isRetained = reachableNodes.has(n.id);
        });

        // Ensure edges originating from now-dead or inactive scopes are severed
        currentMemoryEdges = currentMemoryEdges.filter(e => activeSources.has(e.source));

        const total = currentMemoryNodes.length * 1024;
        const used = currentMemoryNodes.filter(n => n.isRetained).length * 1024;

        steps.push({
            callStack: JSON.parse(JSON.stringify(currentCallStack)),
            webApis: JSON.parse(JSON.stringify(currentWebApis)),
            microtaskQueue: currentMicrotasks.map(({ __execute, ...rest }) => rest),
            macrotaskQueue: currentMacrotasks.map(({ __execute, ...rest }) => rest),
            nextTickQueue: currentNextTick.map(({ __execute, ...rest }) => rest),
            checkQueue: currentCheck.map(({ __execute, ...rest }) => rest),
            memoryHeap: {
                nodes: JSON.parse(JSON.stringify(currentMemoryNodes)),
                edges: JSON.parse(JSON.stringify(currentMemoryEdges)),
                metrics: { total, used }
            },
            consoleOutput: JSON.parse(JSON.stringify(currentConsole)),
            activeLine: currentActiveLine,
        });
    };

    // Initial capture (Frame 0: Global context active)
    capture();

    // 1. AST Instrumentation via Babel
    const instrumentPlugin = function ({ types: t }: any) {
        return {
            visitor: {
                Statement(path: any) {
                    if (path.node.type === 'BlockStatement') return;
                    if (path.node.__injected) return;

                    const line = path.node.loc ? path.node.loc.start.line : null;
                    if (line) {
                        const updateCall = t.expressionStatement(
                            t.callExpression(t.identifier('__updateLine'), [t.numericLiteral(line)])
                        );
                        updateCall.__injected = true;

                        try {
                            path.insertBefore(updateCall);
                        } catch (e) {
                            // ignore insert errors for complex statements
                        }
                    }
                },
                Function(path: any) {
                    const funcName = path.node.id ? path.node.id.name : 'anonymous';
                    const line = path.node.loc ? path.node.loc.start.line : 0;

                    const pushStmt = t.expressionStatement(
                        t.callExpression(t.identifier('__pushToCallStack'), [
                            t.stringLiteral(funcName),
                            t.numericLiteral(line)
                        ])
                    );

                    const popStmt = t.expressionStatement(
                        t.callExpression(t.identifier('__popFromCallStack'), [])
                    );

                    if (path.node.body.type === 'BlockStatement') {
                        path.node.body.body.unshift(pushStmt);

                        // Insert pop before every return
                        path.traverse({
                            ReturnStatement(retPath: any) {
                                if (retPath.getFunctionParent() === path) {
                                    retPath.insertBefore(t.cloneNode(popStmt));
                                }
                            }
                        });

                        // Add pop at end of block if it doesn't return
                        path.node.body.body.push(t.cloneNode(popStmt));
                    }
                },
                VariableDeclarator(path: any) {
                    if (!path.node.init) return;
                    if (path.node.init.type === 'CallExpression' && ['__allocate', '__assign'].includes(path.node.init.callee.name)) return;

                    let type = null;
                    let label = path.node.id.name || 'anon';

                    if (path.node.init.type === 'ObjectExpression') type = 'Object';
                    else if (path.node.init.type === 'ArrayExpression') type = 'Array';
                    else if (['ArrowFunctionExpression', 'FunctionExpression'].includes(path.node.init.type)) type = 'Function';
                    else if (path.node.init.type === 'NewExpression') type = 'Instance';

                    if (type) {
                        const originalInit = path.node.init;
                        path.node.init = t.callExpression(t.identifier('__allocate'), [
                            t.stringLiteral(label),
                            t.stringLiteral(type),
                            originalInit
                        ]);
                    } else {
                        const originalInit = path.node.init;
                        path.node.init = t.callExpression(t.identifier('__assign'), [
                            t.stringLiteral(label),
                            originalInit
                        ]);
                    }
                },
                AssignmentExpression(path: any) {
                    if (path.node.right.type === 'CallExpression' && ['__allocate', '__assign'].includes(path.node.right.callee.name)) return;

                    let type = null;
                    let label = path.node.left.name;
                    if (!label && path.node.left.type === 'MemberExpression') {
                        label = path.node.left.property.name || path.node.left.property.value || 'prop';
                    }
                    if (!label) label = 'anon';

                    if (path.node.right.type === 'ObjectExpression') type = 'Object';
                    else if (path.node.right.type === 'ArrayExpression') type = 'Array';
                    else if (['ArrowFunctionExpression', 'FunctionExpression'].includes(path.node.right.type)) type = 'Function';
                    else if (path.node.right.type === 'NewExpression') type = 'Instance';

                    if (type) {
                        const originalRight = path.node.right;
                        path.node.right = t.callExpression(t.identifier('__allocate'), [
                            t.stringLiteral(label),
                            t.stringLiteral(type),
                            originalRight
                        ]);
                    } else {
                        const originalRight = path.node.right;
                        path.node.right = t.callExpression(t.identifier('__assign'), [
                            t.stringLiteral(label),
                            originalRight
                        ]);
                    }
                }
            }
        };
    };

    let transformedCode = code;
    try {
        const Babel = await import('@babel/standalone');
        const result = Babel.transform(code, {
            plugins: [instrumentPlugin]
        });
        if (result && result.code) {
            transformedCode = result.code;
        }
    } catch (e: any) {
        console.error("Babel Parsing Error:", e);
        // Continue executing untransformed code directly if it fails!
    }

    // 2. Mocking Global Sandbox Execution
    const __updateLine = (line: number) => {
        currentActiveLine = line;
        capture();
    };

    const objectToNodeId = new WeakMap<any, string>();

    const __assign = (label: string, val: any, predefinedId?: string) => {
        const sourceId = currentCallStack.length > 0 ? currentCallStack[currentCallStack.length - 1].id : 'cs-global';

        // Sever existing edge from this source with this label (handling reassignments)
        currentMemoryEdges = currentMemoryEdges.filter(e => !(e.source === sourceId && e.label === label));

        let targetId = predefinedId;
        if (!targetId && val && (typeof val === 'object' || typeof val === 'function')) {
            targetId = objectToNodeId.get(val);
        }

        if (targetId) {
            currentMemoryEdges.push({ source: sourceId, target: targetId, label });
        }

        capture();
        return val;
    };

    const __pushToCallStack = (name: string, line: number, existingId?: string) => {
        currentCallStack.push({ id: existingId || Math.random().toString(), name: `${name}()`, location: `main.js:${line}` });
        capture();
    };

    const __popFromCallStack = () => {
        const popped = currentCallStack.pop();
        if (popped) {
            // Function Scope End: Delete/sever all edges (references) originating from that local scope
            currentMemoryEdges = currentMemoryEdges.filter(e => e.source !== popped.id);
        }
        capture();
    };

    const __allocate = (label: string, type: string, val: any) => {
        const id = 'mem-' + Math.random().toString(36).substr(2, 9);
        currentMemoryNodes.push({ id, label, type, isRetained: true });

        if (val && (typeof val === 'object' || typeof val === 'function')) {
            objectToNodeId.set(val, id);
        }

        return __assign(label, val, id);
    };

    const __setTimeout = (cb: () => void, delay: number) => {
        const timerId = Math.random().toString();
        currentWebApis.push({ id: timerId, name: `setTimeout(..., ${delay || 0})`, type: 'timer' });
        capture(); // Placed into Web APIs

        // Mimic the browser C++ API handing the timer over. 
        // In our event loop logic, we instantly shift it to Macrotasks since we don't 'wait' literally.
        currentWebApis = currentWebApis.filter(api => api.id !== timerId);
        currentMacrotasks.push({
            id: timerId,
            name: cb.name ? cb.name : 'anonymous callback',
            source: 'Timer',
            __execute: () => {
                __pushToCallStack(cb.name ? cb.name : 'timeoutCb', 0, timerId);
                cb();
                __popFromCallStack();
            }
        });
        capture(); // Placed into Macrotask Queue
    };

    const __setInterval = (cb: () => void, delay: number) => {
        __setTimeout(cb, delay); // Simulate as a single timeout for visualization purposes
    };

    const __consoleLog = (...args: any[]) => {
        currentConsole.push(args.map(a => String(a)).join(' '));
        capture();
    };

    const __Promise = {
        resolve: (val: any) => ({
            then: (cb: any) => {
                const promiseId = Math.random().toString();
                currentMicrotasks.push({
                    id: promiseId,
                    name: cb.name ? cb.name : 'anonymous callback',
                    source: 'Promise',
                    __execute: () => {
                        __pushToCallStack(cb.name ? cb.name : 'promiseCb', 0, promiseId);
                        cb(val);
                        __popFromCallStack();
                    }
                });
                capture(); // Placed into Microtask Queue
                return __Promise.resolve(val); // Mock chaining
            }
        })
    };

    const __process = {
        nextTick: (cb: any) => {
            const tickId = Math.random().toString();
            currentNextTick.push({
                id: tickId,
                name: cb.name ? cb.name : 'anonymous callback',
                source: 'NextTick',
                __execute: () => {
                    __pushToCallStack(cb.name ? cb.name : 'nextTickCb', 0, tickId);
                    cb();
                    __popFromCallStack();
                }
            });
            capture();
        }
    };

    const __setImmediate = (cb: any) => {
        const immediateId = Math.random().toString();
        currentCheck.push({
            id: immediateId,
            name: cb.name ? cb.name : 'anonymous callback',
            source: 'Check',
            __execute: () => {
                __pushToCallStack(cb.name ? cb.name : 'immediateCb', 0, immediateId);
                cb();
                __popFromCallStack();
            }
        });
        capture();
    };

    // 3. Evaluation
    try {
        const sandbox = new Function(
            '__pushToCallStack',
            '__popFromCallStack',
            '__updateLine',
            '__allocate',
            '__assign',
            'setTimeout',
            'setInterval',
            'setImmediate',
            'console',
            'Promise',
            'process',
            transformedCode
        );

        sandbox(
            __pushToCallStack,
            __popFromCallStack,
            __updateLine,
            __allocate,
            __assign,
            __setTimeout,
            __setInterval,
            __setImmediate,
            { log: __consoleLog, error: __consoleLog, warn: __consoleLog },
            __Promise,
            __process
        );
    } catch (e: any) {
        __consoleLog(`Error: ${e.message}`);
    }

    // Synchronous execution ends, pop the Global context.
    if (currentCallStack.length > 0) {
        currentCallStack.pop();
        capture();
    }

    // 4. Advanced Event Loop Processing (Simulation) Node.js priority

    const drainMicrotasks = () => {
        let executed = false;
        // Priority 1: nextTickQueue
        while (currentNextTick.length > 0) {
            const task = currentNextTick.shift()!;
            if (task.__execute) task.__execute();
            executed = true;
        }

        // Priority 2: microtaskQueue (Promises)
        while (currentMicrotasks.length > 0) {
            const task = currentMicrotasks.shift()!;
            if (task.__execute) task.__execute();
            executed = true;
        }

        // If promises queued more nextTicks or microtasks, drain again
        if (currentNextTick.length > 0 || currentMicrotasks.length > 0) {
            drainMicrotasks();
        }
    };

    // Drain microtasks first after sync code
    drainMicrotasks();

    // Priority 3: macrotaskQueue / timerQueue
    while (currentMacrotasks.length > 0) {
        const task = currentMacrotasks.shift()!;
        if (task.__execute) task.__execute();

        // The Event Loop MUST check Microtasks again after EACH single Macrotask completes!
        drainMicrotasks();
    }

    // Priority 4: checkQueue
    while (currentCheck.length > 0) {
        const task = currentCheck.shift()!;
        if (task.__execute) task.__execute();

        drainMicrotasks();
    }

    // Eliminate redundant identical snapshots caused by multiple pops/pushes that don't add net value at the end of the frames list.
    return steps.filter((step, index, arr) => {
        if (index === 0) return true;
        const prevString = JSON.stringify(arr[index - 1]);
        const currString = JSON.stringify(step);
        return prevString !== currString;
    });
}
