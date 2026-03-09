import { useState, useCallback, useRef, useEffect } from "react";

export interface SandboxResult {
    success: boolean;
    error?: string;
    consoleOutput: string[];
    // Expandable for full AST Execution steps if needed later
    payload?: any;
}

export function useSandbox() {
    const [isExecuting, setIsExecuting] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    // Cleanup worker cleanly on component unmount
    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const executeCode = useCallback(
        (codeSnippet: string, timeoutMs: number = 2000): Promise<SandboxResult> => {
            return new Promise((resolve) => {
                setIsExecuting(true);

                // Terminate any currently running worker to prevent memory leaks / stale executions
                if (workerRef.current) {
                    workerRef.current.terminate();
                }

                /**
                 * Dynamic Web Worker Code (Sandbox)
                 * 
                 * Security features:
                 * - Runs in an isolated thread context (WorkerGlobalScope).
                 * - No access to DOM, document, window, or parent global objects.
                 * - Intercepts console logging.
                 */
                const workerCode = `
                    self.onmessage = async function(e) {
                        const code = e.data.code;
                        let consoleLogs = [];
                        
                        // Overwrite native console.log to safely capture strings back to the main thread
                        const originalConsoleLog = console.log;
                        console.log = function(...args) {
                            const message = args.map(arg => {
                                if (arg === null) return 'null';
                                if (arg === undefined) return 'undefined';
                                if (typeof arg === 'object') {
                                    try {
                                        return JSON.stringify(arg);
                                    } catch (err) {
                                        return '[Circular Object]';
                                    }
                                }
                                return String(arg);
                            }).join(' ');
                            
                            consoleLogs.push(message);
                            originalConsoleLog.apply(console, args); // Optional: keep raw debug in hidden threads
                        };

                        try {
                            // Using the Function constructor isolates the code slightly more than eval()
                            // and ensures it runs exclusively within this thread's scope.
                            const executeSandbox = new Function(code);
                            
                            // Execute the user's snippet
                            const result = await executeSandbox();
                            
                            self.postMessage({ 
                                success: true, 
                                consoleOutput: consoleLogs,
                                payload: result
                            });
                        } catch (error) {
                            self.postMessage({ 
                                success: false, 
                                error: error.toString(), 
                                consoleOutput: consoleLogs 
                            });
                        }
                    };
                `;

                // Generate dynamic Blob URI without needing external .js files
                const blob = new Blob([workerCode], { type: "application/javascript" });
                const workerUrl = URL.createObjectURL(blob);
                const worker = new Worker(workerUrl);

                workerRef.current = worker;

                let timeoutId: NodeJS.Timeout;

                const cleanup = () => {
                    clearTimeout(timeoutId);
                    if (workerRef.current) {
                        workerRef.current.terminate();
                        workerRef.current = null;
                    }
                    URL.revokeObjectURL(workerUrl);
                    setIsExecuting(false);
                };

                // Kill Switch Mechanism 
                // Forces termination if the while-loop or execution hangs the thread
                timeoutId = setTimeout(() => {
                    cleanup();
                    resolve({
                        success: false,
                        error: "Execution timeout: Infinite loop detected.",
                        consoleOutput: []
                    });
                }, timeoutMs);

                // Receive payload payload back from thread
                worker.onmessage = (e) => {
                    cleanup();
                    resolve({
                        success: e.data.success,
                        error: e.data.error,
                        consoleOutput: e.data.consoleOutput,
                        payload: e.data.payload
                    });
                };

                // Catch syntax errors or uncaught thread crashes 
                worker.onerror = (e) => {
                    cleanup();
                    resolve({
                        success: false,
                        error: e.message || "An unknown error occurred during execution.",
                        consoleOutput: []
                    });
                };

                // Trigger execution!
                worker.postMessage({ code: codeSnippet });
            });
        },
        []
    );

    // Provide manual hook termination out to components
    const terminate = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
            setIsExecuting(false);
        }
    }, []);

    return { executeCode, isExecuting, terminate };
}
