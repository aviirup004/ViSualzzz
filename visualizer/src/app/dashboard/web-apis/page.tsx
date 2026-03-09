"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Activity, ServerCrash } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "@/store/useEngineStore";

export default function WebApisPage() {
    const { webApis } = useEngineStore();
    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#0dccf2]/30">
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 text-[#f43f5e]">
                        <Cpu size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Web APIs <span className="text-slate-400 font-light">: Browser Threads</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden p-4 gap-6 w-full max-w-[1800px] mx-auto">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="glass h-full rounded-xl p-8 border border-slate-800 flex flex-col bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden overflow-y-auto">
                        <div className="absolute inset-0 bg-[#f43f5e]/5 pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#f43f5e]/10 rounded-lg">
                                    <Cpu className="text-[#f43f5e]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Browser Background Threads</h2>
                                    <p className="text-xs font-mono text-[#f43f5e] uppercase tracking-wider">C++ / Rust Native APIs</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="px-3 py-1 rounded bg-slate-800 test-xs text-slate-400 font-mono">Active Tasks: {webApis.length}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 relative z-10 auto-rows-max">

                            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/50 hover:border-[#f43f5e]/50 transition-colors shadow-lg col-span-1 md:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg text-white">Active Native APIs</h3>
                                    <Activity className="text-[#f43f5e] animate-pulse" size={24} />
                                </div>
                                <div className="space-y-4">
                                    {webApis.length === 0 ? (
                                        <div className="text-slate-500 font-mono text-sm p-4 text-center">No active Web APIs</div>
                                    ) : (
                                        <AnimatePresence>
                                            {webApis.map(api => (
                                                <motion.div
                                                    key={api.id}
                                                    layoutId={api.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="p-4 bg-[#f43f5e]/10 border border-[#f43f5e]/30 rounded-lg flex flex-col gap-2"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-mono text-sm text-[#f43f5e] font-bold">{api.name}</span>
                                                        <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded capitalize">{api.type || 'api'}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                                                        <div className="bg-[#f43f5e] h-full shadow-[0_0_10px_#f43f5e]" style={{ width: '60%' }}></div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>
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
