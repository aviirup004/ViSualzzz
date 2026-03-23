"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Save, Layers, MemoryStick, Cpu, AlertCircle, List, ArrowUpRight, Activity, Server, Zap, Timer, Loader2, CheckCircle2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "@/store/useEngineStore";
import { saveSnippetSnapshot } from "@/lib/firebase";
import ShareModal from "@/components/ShareModal";

type Environment = "browser" | "node";

export default function DashboardPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const { codeSnippet, environment: env, setEnvironment: setEnv, callStack, webApis, microtaskQueue, macrotaskQueue, nextTickQueue, checkQueue, consoleOutput } = useEngineStore();

    const handleSaveSnapshot = async () => {
        setIsSaving(true);
        try {
            // Serverless Snippet Sharing! Compress to base64url so Firebase is unneeded.
            const payload = JSON.stringify({ c: codeSnippet, e: env });
            const encoded = btoa(encodeURIComponent(payload))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            
            const url = `${window.location.origin}/share/${encoded}`;
            setShareUrl(url);
            setIsShareModalOpen(true);
        } catch (error) {
            console.error("Failed to generate share URL", error);
            alert("Failed to create snapshot link. The code snippet may be too large.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#0dccf2]/30">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-3 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <Link href="/" className="text-3xl md:text-4xl font-black tracking-tight flex select-none cursor-pointer font-display text-white drop-shadow-lg">
                    {"ViSualzzz".split("").map((letter, i) => (
                        <motion.span
                            key={i}
                            whileHover={{
                                scale: 1.25,
                                color: "#0dccf2",
                                textShadow: "0 0 20px rgba(13,204,242,0.8)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="inline-block hover:z-10 relative"
                        >
                            {letter}
                        </motion.span>
                    ))}
                </Link>
                <div className="flex items-center gap-4">
                    {/* Environment Toggle */}
                    <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 relative mr-2">
                        <button
                            suppressHydrationWarning={true}
                            onClick={() => setEnv("browser")}
                            className={`relative px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors z-10 ${env === "browser" ? "text-slate-900" : "text-slate-400 hover:text-white"}`}
                        >
                            Browser
                            {env === "browser" && (
                                <motion.div
                                    layoutId="envToggle"
                                    className="absolute inset-0 bg-[#06b6d4] rounded-full z-[-1] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                        <button
                            suppressHydrationWarning={true}
                            onClick={() => setEnv("node")}
                            className={`relative px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors z-10 ${env === "node" ? "text-slate-900" : "text-slate-400 hover:text-white"}`}
                        >
                            Node.js
                            {env === "node" && (
                                <motion.div
                                    layoutId="envToggle"
                                    className="absolute inset-0 bg-[#06b6d4] rounded-full z-[-1] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5 border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                        <span className="text-xs font-mono text-slate-300">v8: Execution Active</span>
                    </div>
                    <button
                        onClick={handleSaveSnapshot}
                        disabled={isSaving}
                        className={`min-w-[120px] justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(13,204,242,0.3)] ${isSaving ? 'bg-[#0dccf2]/50 text-[#0F172A]/70 cursor-not-allowed' : 'bg-[#0dccf2] text-[#0F172A] hover:brightness-110'}`}
                    >
                        {isSaving ? (
                            <><Loader2 size={16} className="animate-spin" /> Saving</>
                        ) : (
                            <><Save size={16} /> Share</>
                        )}
                    </button>
                </div>
            </header >

            {/* Main Content */}
            < main className="flex flex-1 overflow-hidden p-4 gap-4 w-full max-w-[1800px] mx-auto" >

                {/* Visualizations Base (Left Col) */}
                < div className="flex-1 flex flex-col gap-4 overflow-hidden relative group border border-transparent" >
                    <div className="grid grid-cols-2 gap-4 h-1/2 min-h-[300px]">
                        <Link href="/dashboard/call-stack" className="glass rounded-xl p-4 flex flex-col border border-slate-800 relative hover:border-[#0dccf2]/50 hover:shadow-[0_0_20px_rgba(13,204,242,0.15)] transition-all bg-[#0F172A]/60 backdrop-blur-sm cursor-pointer group/item">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Layers className="text-[#0dccf2]" size={18} />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#0dccf2] transition-colors">Call Stack</h3>
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover/item:text-[#0dccf2] transition-colors" />
                            </div>
                            <div className="flex flex-col-reverse gap-2 flex-1 overflow-y-auto pr-1">
                                <AnimatePresence initial={false}>
                                    {callStack.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            layoutId={item.id}
                                            initial={{ opacity: 0, x: -20, backgroundColor: "#10b98166" }}
                                            animate={{ opacity: 1, x: 0, backgroundColor: index === callStack.length - 1 ? "rgba(13,204,242,0.2)" : "rgba(30,41,59,0.8)" }}
                                            exit={{ opacity: 0, x: 20, backgroundColor: "#ef444466" }}
                                            transition={{ duration: 0.3 }}
                                            className={`p-3 border rounded-lg text-xs font-mono flex justify-between items-center shadow-[0_0_10px_rgba(13,204,242,0.1)] ${index === callStack.length - 1 ? 'border-[#0dccf2]/40 text-[#0dccf2]' : 'border-slate-700 text-slate-300'}`}
                                        >
                                            {item.name}
                                            {index === callStack.length - 1 && <span className="w-2 h-2 rounded-full bg-[#0dccf2] animate-ping"></span>}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </Link>

                        <div className="flex flex-col gap-4">
                            <Link href="/dashboard/memory-heap" className="glass rounded-xl p-4 h-1/2 border border-slate-800 hover:border-[#10b981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all bg-[#0F172A]/60 backdrop-blur-sm cursor-pointer group/item">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <MemoryStick className="text-[#10b981]" size={18} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#10b981] transition-colors">Memory Heap</h3>
                                    </div>
                                    <ArrowUpRight size={16} className="text-slate-500 group-hover/item:text-[#10b981] transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
                                    <div className="p-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg flex justify-between items-center">
                                        <span className="text-xs font-mono text-[#10b981]">global.context</span>
                                        <span className="text-[10px] text-slate-500">0x4F2A</span>
                                    </div>
                                </div>
                            </Link>

                            <div className="h-1/2 relative">
                                <AnimatePresence mode="wait">
                                    {env === "browser" ? (
                                        <motion.div
                                            key="browser-apis"
                                            initial={{ opacity: 0, rotateX: -90 }}
                                            animate={{ opacity: 1, rotateX: 0 }}
                                            exit={{ opacity: 0, rotateX: 90 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="h-full w-full absolute inset-0"
                                            style={{ transformOrigin: "top" }}
                                        >
                                            <Link href="/dashboard/web-apis" className="glass rounded-xl p-4 h-full border border-slate-800 bg-[#0F172A]/60 backdrop-blur-sm hover:border-[#f43f5e]/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all cursor-pointer group/item flex flex-col justify-between overflow-hidden relative">
                                                <div className="flex items-center justify-between mb-3 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <Cpu className="text-[#f43f5e]" size={18} />
                                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#f43f5e] transition-colors">Web APIs</h3>
                                                    </div>
                                                    <ArrowUpRight size={16} className="text-slate-500 group-hover/item:text-[#f43f5e] transition-colors" />
                                                </div>
                                                <div className="space-y-2 relative z-10">
                                                    <AnimatePresence>
                                                        {webApis.map(api => (
                                                            <motion.div
                                                                key={api.id}
                                                                layoutId={api.id}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="p-2 bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-lg flex flex-col"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-mono text-[#f43f5e]">{api.name}</span>
                                                                    <Activity className="animate-spin text-[#f43f5e]" size={14} />
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="absolute inset-0 bg-[#f43f5e]/5 group-hover/item:bg-transparent transition-colors z-0" />
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="node-apis"
                                            initial={{ opacity: 0, rotateX: -90 }}
                                            animate={{ opacity: 1, rotateX: 0 }}
                                            exit={{ opacity: 0, rotateX: 90 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="h-full w-full absolute inset-0"
                                            style={{ transformOrigin: "top" }}
                                        >
                                            <Link href="/dashboard/node-apis" className="glass rounded-xl p-4 h-full border border-slate-800 bg-[#0F172A]/60 backdrop-blur-sm hover:border-[#10b981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer group/item flex flex-col justify-between overflow-hidden relative">
                                                <div className="flex items-center justify-between mb-3 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <Server className="text-[#10b981]" size={18} />
                                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#10b981] transition-colors">C++ APIs / libuv</h3>
                                                    </div>
                                                    <ArrowUpRight size={16} className="text-slate-500 group-hover/item:text-[#10b981] transition-colors" />
                                                </div>
                                                <div className="space-y-2 relative z-10 flex flex-col items-center w-full">
                                                    <AnimatePresence>
                                                        {webApis.map(api => (
                                                            <motion.div
                                                                key={api.id}
                                                                layoutId={`api-${api.id}`}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="w-full p-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg flex items-center justify-between"
                                                            >
                                                                <span className="text-[10px] font-mono text-[#10b981] truncate">{api.name}</span>
                                                                <Activity className="animate-spin text-[#10b981] flex-shrink-0" size={14} />
                                                            </motion.div>
                                                        ))}
                                                        {webApis.length === 0 && (
                                                            <span className="text-[10px] font-mono text-slate-600 mt-2 italic">Idle...</span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="absolute inset-0 bg-[#10b981]/5 group-hover/item:bg-transparent transition-colors z-0" />
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Queues Row */}
                    <div className="flex-1 relative min-h-[250px]">
                        <AnimatePresence mode="wait">
                            {env === "browser" ? (
                                <motion.div
                                    key="browser-queues"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col gap-4 h-full"
                                >
                                    <Link href="/dashboard/microtask-queue" className="glass rounded-xl p-4 border border-slate-800/50 flex-1 flex flex-col hover:border-[#fbbf24]/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="text-[#fbbf24]" size={14} />
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#fbbf24] transition-colors">Microtask Queue</h3>
                                            </div>
                                            <ArrowUpRight size={12} className="text-slate-500 group-hover/item:text-[#fbbf24] transition-colors" />
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 items-center">
                                            <AnimatePresence>
                                                {microtaskQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={item.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="min-w-[100px] h-[52px] bg-[#fbbf24]/20 border border-[#fbbf24]/30 rounded-lg p-2 flex flex-col justify-center shadow-inner"
                                                    >
                                                        <span className="text-[9px] text-[#fbbf24] font-bold uppercase block">{item.source}</span>
                                                        <span className="text-[10px] font-mono truncate text-white">{item.name}</span>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </Link>

                                    <Link href="/dashboard/macrotask-queue" className="glass rounded-xl p-4 border border-slate-800/50 flex-1 flex flex-col hover:border-[#a855f7]/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <List className="text-[#a855f7]" size={14} />
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover/item:text-[#a855f7] transition-colors">Macrotask Queue</h3>
                                            </div>
                                            <ArrowUpRight size={12} className="text-slate-500 group-hover/item:text-[#a855f7] transition-colors" />
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 items-center">
                                            <AnimatePresence>
                                                {macrotaskQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={item.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="min-w-[100px] h-[52px] bg-[#a855f7]/20 border border-[#a855f7]/30 rounded-lg p-2 flex flex-col justify-center shadow-inner"
                                                    >
                                                        <span className="text-[9px] text-[#a855f7] font-bold uppercase block">{item.source}</span>
                                                        <span className="text-[10px] font-mono truncate text-white">{item.name}</span>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="node-queues"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col gap-2 h-full justify-between"
                                >
                                    {/* Next Tick Queue */}
                                    <div className="glass rounded-xl px-3 py-1.5 border border-red-500/40 flex items-center justify-between hover:border-red-500/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer flex-1 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                        <div className="flex items-center gap-2 w-1/4 min-w-[120px]">
                                            <Zap className="text-red-500" size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">Next Tick</h3>
                                        </div>
                                        <div className="flex gap-2 w-3/4 justify-start overflow-hidden relative items-center">
                                            <AnimatePresence>
                                                {nextTickQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={`node-queue-${item.id}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="bg-red-500/20 border border-red-500/40 rounded px-3 py-1 text-[10px] font-mono font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)] whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0F172A] to-transparent z-10" />
                                        </div>
                                    </div>

                                    {/* Microtask Queue */}
                                    <div className="glass rounded-xl px-4 py-2 border border-[#fbbf24]/30 flex items-center justify-between hover:border-[#fbbf24]/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer flex-1">
                                        <div className="flex items-center gap-2 w-1/4 min-w-[120px]">
                                            <AlertCircle className="text-[#fbbf24]" size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#fbbf24]">Microtask</h3>
                                        </div>
                                        <div className="flex gap-2 w-3/4 justify-start overflow-hidden relative items-center">
                                            <AnimatePresence>
                                                {microtaskQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={`node-queue-${item.id}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="bg-[#fbbf24]/20 border border-[#fbbf24]/30 rounded px-3 py-1 text-[10px] font-mono text-white whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0F172A] to-transparent z-10" />
                                        </div>
                                    </div>

                                    {/* Timer Queue */}
                                    <div className="glass rounded-xl px-4 py-2 border border-[#a855f7]/30 flex items-center justify-between hover:border-[#a855f7]/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer flex-1">
                                        <div className="flex items-center gap-2 w-1/4 min-w-[120px]">
                                            <Timer className="text-[#a855f7]" size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a855f7]">Timer</h3>
                                        </div>
                                        <div className="flex gap-2 w-3/4 justify-start overflow-hidden relative items-center">
                                            <AnimatePresence>
                                                {macrotaskQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={`node-queue-${item.id}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="bg-[#a855f7]/20 border border-[#a855f7]/30 rounded px-3 py-1 text-[10px] font-mono text-white whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0F172A] to-transparent z-10" />
                                        </div>
                                    </div>

                                    {/* Check Queue */}
                                    <div className="glass rounded-xl px-4 py-2 border border-blue-500/30 flex items-center justify-between hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all bg-[#0F172A]/60 backdrop-blur-sm group/item cursor-pointer flex-1">
                                        <div className="flex items-center gap-2 w-1/4 min-w-[120px]">
                                            <List className="text-blue-500" size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Check</h3>
                                        </div>
                                        <div className="flex gap-2 w-3/4 justify-start overflow-hidden relative items-center">
                                            <AnimatePresence>
                                                {checkQueue.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        layoutId={`node-queue-${item.id}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="bg-blue-500/20 border border-blue-500/30 rounded px-3 py-1 text-[10px] font-mono text-white whitespace-nowrap"
                                                    >
                                                        {item.name}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0F172A] to-transparent z-10" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div >

                {/* Vertical Separator */}
                < div className="w-px bg-slate-800/50 mx-2" ></div >

                {/* Right Side: Code Writing Section Always Present */}
                < CodeEditor />
            </main >

            {/* Modals */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareUrl={shareUrl || ""}
            />
        </div >
    );
}
