"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle, Activity } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "@/store/useEngineStore";

export default function MicrotaskQueuePage() {
    const { microtaskQueue } = useEngineStore();
    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#fbbf24]/30">
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 text-[#fbbf24]">
                        <AlertCircle size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Microtask Queue <span className="text-slate-400 font-light">: High Priority Operations</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-lg text-xs font-mono text-[#fbbf24] shadow-inner">
                        Resolving Before Render Frame
                    </span>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden p-4 gap-6 w-full max-w-[1800px] mx-auto">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="glass h-full rounded-xl p-8 border border-slate-800 flex flex-col bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden overflow-y-auto">
                        <div className="absolute inset-0 bg-[#fbbf24]/5 pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#fbbf24]/10 rounded-lg">
                                    <AlertCircle className="text-[#fbbf24]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Pending Microtasks</h2>
                                    <p className="text-xs font-mono text-[#fbbf24] uppercase tracking-wider">Promises, MutationObsever, queueMicrotask</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-mono font-bold text-white">{microtaskQueue.length}</span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Queue</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10 h-full max-w-3xl mx-auto w-full pt-10">

                            <div className="w-full min-h-[100px] border-x-[4px] border-b-[4px] border-[#fbbf24]/30 rounded-b-3xl relative p-6 flex flex-col justify-end gap-4 pb-8">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-[#fbbf24] tracking-[0.3em] uppercase opacity-50">FIFO QUEUE</span>

                                {microtaskQueue.length === 0 ? (
                                    <div className="text-slate-500 font-mono text-sm p-4 text-center pb-8">Queue is empty</div>
                                ) : (
                                    <AnimatePresence>
                                        {microtaskQueue.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                layoutId={item.id}
                                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                                className="w-full bg-[#fbbf24] text-[#0F172A] p-4 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.3)] flex items-center justify-between transform transition-transform hover:scale-[1.02] cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#0F172A]/10 flex items-center justify-center">
                                                        <CheckCircle size={20} className="text-[#0F172A]/80" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                                        <p className="text-xs font-mono opacity-80 mt-1 capitalize">{item.source}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {index === 0 && <span className="text-xs font-bold uppercase tracking-widest opacity-70">Next Execution</span>}
                                                    {index === 0 && <Activity className="animate-pulse mt-1" size={16} />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
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
