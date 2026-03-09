import { create } from 'zustand';
import { generateExecutionSteps, EngineStateSnapshot, StackItem, WebApiItem, QueueItem, MemoryHeap } from '@/lib/engine';

interface EngineStore {
    codeSnippet: string;
    setCodeSnippet: (code: string) => void;
    generateAndSetFrames: (code: string, safeConsoleLogs?: string[]) => Promise<void>;
    updateConsole: (logs: string[]) => void;
    environment: string;
    setEnvironment: (env: string) => void;

    frames: EngineStateSnapshot[];
    currentFrameIndex: number;
    nextFrame: () => void;
    prevFrame: () => void;
    reset: () => void;

    callStack: StackItem[];
    webApis: WebApiItem[];
    microtaskQueue: QueueItem[];
    macrotaskQueue: QueueItem[];
    nextTickQueue: QueueItem[];
    checkQueue: QueueItem[];
    memoryHeap: MemoryHeap;
    consoleOutput: string[];
    activeLine?: number;

    isPlaying: boolean;
    playbackSpeed: number;
    play: () => void;
    pause: () => void;
    setFrameIndex: (index: number) => void;
    setPlaybackSpeed: (speed: number) => void;
    stepMode: 'line' | 'tick';
    setStepMode: (mode: 'line' | 'tick') => void;
    forceGC: () => void;
}

const defaultCode = `function fetchData() {\n  setTimeout(() => {\n    console.log('Macrotask');\n  }, 0);\n}\n\nfetchData();\n\nPromise.resolve().then(() => {\n  console.log("Microtask");\n});`;

// Fallback to empty snapshot if somehow generator fails instantly
const fallbackSnapshot: EngineStateSnapshot = { callStack: [], webApis: [], microtaskQueue: [], macrotaskQueue: [], nextTickQueue: [], checkQueue: [], memoryHeap: { nodes: [], edges: [], metrics: { total: 0, used: 0 } }, consoleOutput: [] };

const initialFrames = [fallbackSnapshot];

export const useEngineStore = create<EngineStore>((set) => ({
    codeSnippet: defaultCode,
    environment: "browser",
    frames: initialFrames,
    currentFrameIndex: 0,

    callStack: initialFrames[0].callStack,
    webApis: initialFrames[0].webApis,
    microtaskQueue: initialFrames[0].microtaskQueue,
    macrotaskQueue: initialFrames[0].macrotaskQueue,
    nextTickQueue: initialFrames[0].nextTickQueue,
    checkQueue: initialFrames[0].checkQueue,
    memoryHeap: initialFrames[0].memoryHeap,
    consoleOutput: initialFrames[0].consoleOutput,
    activeLine: initialFrames[0].activeLine,

    isPlaying: false,
    playbackSpeed: 1000,
    stepMode: 'tick',

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    setStepMode: (mode) => set({ stepMode: mode }),
    setEnvironment: (env) => set({ environment: env }),

    setCodeSnippet: (code) => set({ codeSnippet: code }),

    generateAndSetFrames: async (code, safeConsoleLogs) => {
        let frames = await generateExecutionSteps(code);
        if (!frames || frames.length === 0) frames = [fallbackSnapshot];
        // If sandbox provides sanitized console logs due to AST parse failures, use them
        if (safeConsoleLogs && safeConsoleLogs.length > 0 && frames[0].consoleOutput.length === 0) {
            frames.forEach(f => { f.consoleOutput = safeConsoleLogs });
        }
        set({
            frames,
            currentFrameIndex: 0,
            ...frames[0]
        });
    },

    updateConsole: (logs) => set({ consoleOutput: logs }),

    nextFrame: () => set((state) => {
        let nextIndex = state.currentFrameIndex + 1;
        if (nextIndex >= state.frames.length) nextIndex = state.frames.length - 1;

        if (state.stepMode === 'line') {
            const currentLine = state.frames[state.currentFrameIndex].activeLine;
            while (nextIndex < state.frames.length - 1 && state.frames[nextIndex].activeLine === currentLine) {
                nextIndex++;
            }
        }

        return {
            currentFrameIndex: nextIndex,
            ...state.frames[nextIndex]
        };
    }),

    prevFrame: () => set((state) => {
        let prevIndex = state.currentFrameIndex - 1;
        if (prevIndex < 0) prevIndex = 0;

        if (state.stepMode === 'line') {
            const currentLine = state.frames[state.currentFrameIndex].activeLine;
            while (prevIndex > 0 && state.frames[prevIndex].activeLine === currentLine) {
                prevIndex--;
            }
        }

        return {
            currentFrameIndex: prevIndex,
            ...state.frames[prevIndex]
        };
    }),

    setFrameIndex: (index) => set((state) => {
        const safeIndex = Math.max(0, Math.min(index, state.frames.length - 1));
        return {
            currentFrameIndex: safeIndex,
            ...state.frames[safeIndex]
        };
    }),

    forceGC: () => set((state) => {
        if (state.isPlaying) return state;

        const newFrames = [...state.frames];
        for (let i = state.currentFrameIndex; i < newFrames.length; i++) {
            const f = { ...newFrames[i] };
            const m = { ...f.memoryHeap };
            m.nodes = m.nodes.filter(n => n.isRetained);

            const liveIds = new Set(m.nodes.map(n => n.id));
            liveIds.add('cs-global');
            state.callStack.forEach(cs => liveIds.add(cs.id));

            m.edges = m.edges.filter(e => liveIds.has(e.source) && liveIds.has(e.target));
            m.metrics = {
                total: m.nodes.length * 1024,
                used: m.nodes.filter(n => n.isRetained).length * 1024
            };
            f.memoryHeap = m;
            newFrames[i] = f;
        }

        return {
            frames: newFrames,
            ...newFrames[state.currentFrameIndex]
        };
    }),

    reset: () => set((state) => ({
        currentFrameIndex: 0,
        isPlaying: false,
        ...state.frames[0]
    })),
}));

export type { StackItem, WebApiItem, QueueItem, EngineStateSnapshot, MemoryHeap };
