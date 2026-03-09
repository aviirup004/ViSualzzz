"use client";

import Link from "next/link";
import { ArrowLeft, Layers, Play, Pause, StepForward } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "@/store/useEngineStore";

export default function CallStackPage() {
    const { callStack } = useEngineStore();
    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#0dccf2]/30">
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 text-[#0dccf2]">
                        <Layers size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Call Stack <span className="text-slate-400 font-light">: Deep Dive</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5 border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                        <span className="text-xs font-mono text-slate-300">Live Execution</span>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden p-4 gap-6 w-full max-w-[1800px] mx-auto">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="glass h-full rounded-xl p-6 border border-slate-800 flex flex-col bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#0dccf2]/5 pointer-events-none" />
                        <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#0dccf2]/10 rounded-lg">
                                    <Layers className="text-[#0dccf2]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Execution Stack</h2>
                                    <p className="text-xs font-mono text-[#0dccf2] uppercase tracking-wider">LIFO Structure</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">Depth: {callStack.length} / 10000</span>
                        </div>

                        <div className="flex flex-col-reverse gap-4 flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 pb-12 pt-4">
                            <AnimatePresence initial={false}>
                                {callStack.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        initial={{ opacity: 0, y: -20, scale: 0.95, backgroundColor: "#10b98166", boxShadow: "0 0 30px #10b981" }}
                                        animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: index === callStack.length - 1 ? "rgba(13,204,242,0.2)" : "rgba(30,41,59,0.8)", boxShadow: "0 0 0px transparent" }}
                                        exit={{ opacity: 0, y: 20, scale: 0.95, backgroundColor: "#ef444466", boxShadow: "0 0 30px #ef4444" }}
                                        transition={{ duration: 0.4 }}
                                        className={`p-5 border-[2px] rounded-lg text-sm font-mono flex justify-between items-center group cursor-pointer transition-colors relative overflow-hidden ${index === callStack.length - 1 ? 'border-[#0dccf2]/60 text-[#0dccf2] shadow-[0_0_20px_rgba(13,204,242,0.3)]' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}
                                    >
                                        {index === callStack.length - 1 && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0dccf2]/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />}
                                        <span className={`font-bold relative z-10 ${index === callStack.length - 1 ? 'text-lg' : ''}`}>{item.name}</span>
                                        <div className="flex items-center gap-4 relative z-10">
                                            {item.location && <span className={`text-xs ${index === callStack.length - 1 ? 'font-bold text-[#0dccf2]/80 bg-[#0dccf2]/10 px-2 py-1 rounded' : 'text-slate-500'}`}>{item.location}</span>}
                                            {index === callStack.length - 1 && <span className="w-3 h-3 rounded-full bg-[#0dccf2] animate-ping shadow-[0_0_12px_#0dccf2]"></span>}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px bg-slate-800/50 mx-2"></div>

                {/* Code Editor Always on Right */}
                <CodeEditor />
            </main>
        </div>
    );
}
