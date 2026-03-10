"use client";

import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Play, Pause, StepForward, RotateCcw, Terminal, Loader2 } from "lucide-react";
import { useEngineStore } from "@/store/useEngineStore";
import { useSandbox } from "@/hooks/useSandbox";

const defaultCode = `function fetchData() {
  setTimeout(() => {
    console.log('Macrotask');
  }, 0);
}

fetchData();

Promise.resolve().then(() => {
  console.log("Microtask");
});`;

interface CodeEditorProps {
    readOnly?: boolean;
}

export default function CodeEditor({ readOnly = false }: CodeEditorProps) {
    const {
        codeSnippet, setCodeSnippet,
        nextFrame, reset, consoleOutput,
        activeLine, isPlaying, play, pause,
        setFrameIndex, frames, currentFrameIndex, playbackSpeed,
        stepMode, setStepMode, generateAndSetFrames, updateConsole
    } = useEngineStore();

    const { executeCode, isExecuting } = useSandbox();
    const [lastEvaluatedCode, setLastEvaluatedCode] = useState("");

    const monaco = useMonaco();
    const editorRef = useRef<any>(null);
    const decorationsRef = useRef<string[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentFrameIndex >= frames.length - 1) {
                    pause();
                } else {
                    nextFrame();
                }
            }, playbackSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentFrameIndex, frames.length, playbackSpeed, nextFrame, pause]);

    useEffect(() => {
        if (editorRef.current) {
            if (activeLine !== undefined) {
                decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
                    {
                        range: { startLineNumber: activeLine, startColumn: 1, endLineNumber: activeLine, endColumn: 1 },
                        options: {
                            isWholeLine: true,
                            className: 'active-line-highlight',
                        }
                    }
                ]);
            } else {
                decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
            }
        }
    }, [activeLine]);

    const handlePlayToggle = async () => {
        if (isPlaying) {
            pause();
            return;
        }

        // If the code changed, we dry-run in the isolated sandbox to prevent UI thread infinite loops
        if (codeSnippet !== lastEvaluatedCode) {
            pause();
            const { success, error, consoleOutput: workerConsole } = await executeCode(codeSnippet);

            if (!success) {
                updateConsole([`[System Sandbox Error] ${error}`]);
                alert(`Infinite Loop or Execution Error Caught:\n\n${error}`);
                reset(); // Halt engine
                return;
            }

            // Survived sandbox check! Safe to run synchronous AST Visualizer Engine
            setLastEvaluatedCode(codeSnippet);
            await generateAndSetFrames(codeSnippet, workerConsole);
        }

        // If we were at the end, restart
        if (currentFrameIndex >= frames.length - 1 && frames.length > 0) {
            setFrameIndex(0);
        }

        play();
    };

    // Side-effects should never run on the render thread to avoid Next.js Strict Mode hydration crashes!
    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme('visualizerTheme', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#1e293b00', // transparent so our background shows through
                    'editor.lineHighlightBackground': '#0dccf21a'
                }
            });
            monaco.editor.setTheme('visualizerTheme');
        }
    }, [monaco]);

    return (
        <div className="w-[45%] flex flex-col gap-4 h-full min-w-[350px]">
            <style>{`
                .active-line-highlight {
                    background-color: rgba(6, 182, 212, 0.2) !important;
                    border-left: 3px solid #06b6d4 !important;
                }
            `}</style>
            <div className="glass rounded-xl overflow-hidden flex flex-col flex-1 border border-slate-800 shadow-2xl bg-[#0F172A]/80 backdrop-blur-md">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="text-[#0dccf2] text-sm font-mono">&#x276E;/&#x276F;</span>
                        <span className="text-xs font-mono text-slate-400">main.js</span>
                    </div>
                </div>

                {/* Monaco Editor Container */}
                <div className="flex-1 w-full bg-[#1e293b]/30 py-4 relative">
                    <Editor
                        height="100%"
                        language="javascript"
                        theme="visualizerTheme"
                        value={codeSnippet}
                        onMount={(editor) => { editorRef.current = editor; }}
                        onChange={!readOnly ? (value) => setCodeSnippet(value || '') : undefined}
                        options={{
                            readOnly: readOnly,
                            domReadOnly: readOnly,
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                            tabSize: 2,
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: "smooth",
                            padding: { top: 16 },
                            lineNumbersMinChars: 4,
                            overviewRulerLanes: 0,
                            hideCursorInOverviewRuler: true,
                            scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden'
                            }
                        }}
                        loading={<div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm tracking-widest animate-pulse">Initializing Editor...</div>}
                    />
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                    {/* Time-Travel Scrubber */}
                    <div className="w-full group flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-mono w-4">{currentFrameIndex}</span>
                        <input
                            type="range"
                            min={0}
                            max={frames.length > 0 ? frames.length - 1 : 0}
                            value={currentFrameIndex}
                            onChange={(e) => {
                                pause();
                                setFrameIndex(Number(e.target.value));
                            }}
                            className="w-full flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0dccf2]"
                        />
                        <span className="text-[10px] text-slate-500 font-mono w-4 text-right">{frames.length > 0 ? frames.length - 1 : 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={handlePlayToggle} disabled={isExecuting} className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${isExecuting ? 'bg-slate-700 text-amber-400 cursor-wait' : isPlaying ? 'bg-amber-400 text-[#0F172A] shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:scale-105' : 'bg-[#0dccf2] text-[#0F172A] shadow-[0_0_15px_rgba(13,204,242,0.4)] hover:scale-105'}`}>
                                {isExecuting ? <Loader2 size={16} className="animate-spin" /> : isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} />}
                            </button>
                            <button onClick={reset} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors">
                                <RotateCcw size={16} />
                            </button>
                            <button onClick={nextFrame} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#0dccf2] hover:text-[#0F172A] transition-colors group relative">
                                <StepForward fill="currentColor" size={16} />
                                <span className="absolute -top-8 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">Next Frame</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Store Linked</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setStepMode('line')}
                                    className={`px-2 py-1 rounded text-[10px] transition-colors border ${stepMode === 'line' ? 'bg-[#0dccf2]/20 text-[#0dccf2] border-[#0dccf2]/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                                >
                                    Line
                                </button>
                                <button
                                    onClick={() => setStepMode('tick')}
                                    className={`px-2 py-1 rounded text-[10px] transition-colors border ${stepMode === 'tick' ? 'bg-[#0dccf2]/20 text-[#0dccf2] border-[#0dccf2]/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                                >
                                    Tick
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Console Output Block */}
            <div className="glass rounded-xl overflow-hidden h-1/4 min-h-[150px] border border-slate-800 shadow-2xl bg-[#0F172A]/90 backdrop-blur-md flex flex-col">
                <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800 gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-400 font-bold tracking-wider">Console Output</span>
                </div>
                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs flex flex-col gap-1">
                    {consoleOutput.length === 0 ? (
                        <span className="text-slate-600 italic">No output yet...</span>
                    ) : (
                        consoleOutput.map((log, i) => (
                            <div key={i} className="text-slate-300 border-b border-slate-800/50 pb-1 flex gap-2 w-full">
                                <span className="text-slate-500">{'>'}</span>
                                <span className="text-white">{log}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
