"use client";

import Link from "next/link";
import { ArrowLeft, List, Timer, Server } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "@/store/useEngineStore";

export default function MacrotaskQueuePage() {
    const { macrotaskQueue } = useEngineStore();
    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#a855f7]/30">
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 text-[#a855f7]">
                        <List size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Macrotask Queue <span className="text-slate-400 font-light">: Task Scheduling</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden p-4 gap-6 w-full max-w-[1800px] mx-auto">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="glass h-full rounded-xl p-8 border border-slate-800 flex flex-col bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden overflow-y-auto">
                        <div className="absolute inset-0 bg-[#a855f7]/5 pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#a855f7]/10 rounded-lg">
                                    <List className="text-[#a855f7]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Pending Macrotasks</h2>
                                    <p className="text-xs font-mono text-[#a855f7] uppercase tracking-wider">setTimeout, setInterval, Events, I/O</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-mono font-bold text-white">{macrotaskQueue.length}</span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Queue</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10 h-full max-w-3xl mx-auto w-full pt-10">

                            <div className="w-full min-h-[300px] border-x-[4px] border-b-[4px] border-[#a855f7]/30 rounded-b-3xl relative p-6 flex flex-col justify-end gap-4 pb-8">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-[#a855f7] tracking-[0.3em] uppercase opacity-50">FIFO TASK QUEUE</span>

                                {macrotaskQueue.length === 0 ? (
                                    <div className="text-slate-500 font-mono text-sm p-4 text-center pb-8">Queue is empty</div>
                                ) : (
                                    <AnimatePresence>
                                        {macrotaskQueue.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                layoutId={item.id}
                                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                                className="w-full bg-slate-800 text-white p-4 rounded-xl border border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.1)] flex items-center justify-between hover:bg-slate-700 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                                                        <Timer size={20} className="text-[#a855f7] group-hover:animate-spin" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-[#a855f7] capitalize">{item.source}</h3>
                                                        <p className="text-xs font-mono text-slate-400 mt-1">{item.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest">{index === 0 ? 'Next' : 'Waiting'}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>

                            <div className="text-center mt-4 text-xs font-mono text-slate-500 italic">
                                * Will execute only after Microtask Queue is completely empty
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
