"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Search, Eraser, X } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { useEngineStore } from "@/store/useEngineStore";
import { motion, AnimatePresence } from "framer-motion";

export default function MemoryHeapPage() {
    const { memoryHeap, forceGC, isPlaying } = useEngineStore();
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    const getNodePos = (index: number, total: number) => {
        const i = index;
        const radius = Math.min(25 + (i * 2), 40);
        const angle = (i / (total || 1)) * Math.PI * 2 + (Math.PI / 4);
        return {
            x: 50 + Math.cos(angle) * radius,
            y: 55 + Math.sin(angle) * (radius * 0.8)
        };
    };

    const nodePositions = new Map(
        memoryHeap.nodes.map((n, i) => [n.id, getNodePos(i, memoryHeap.nodes.length)])
    );

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 KB';
        const k = 1024;
        return (bytes / k).toFixed(1) + ' KB';
    };

    const usedPercentage = memoryHeap.metrics.total > 0
        ? Math.min((memoryHeap.metrics.used / memoryHeap.metrics.total) * 100, 100)
        : 0;

    return (
        <div className="bg-[#0F172A] font-sans text-slate-100 overflow-hidden h-screen flex flex-col selection:bg-[#0dccf2]/30">
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 text-[#10b981]">
                        <Database size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Memory Heap <span className="text-slate-400 font-light">: Garbage Collection</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${isInspectorOpen ? 'bg-[#10b981] text-[#0F172A]' : 'bg-[#1e293b] border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/10'}`}
                    >
                        <Search size={16} /> Inspect
                    </button>
                    <button
                        onClick={forceGC}
                        disabled={isPlaying}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${isPlaying ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700' : 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20'}`}
                    >
                        <Eraser size={16} /> Force GC
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden p-4 gap-6 w-full max-w-[1800px] mx-auto">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="glass h-full rounded-xl p-6 border border-slate-800 flex flex-col bg-[#020617]/50 backdrop-blur-md shadow-2xl relative overflow-hidden group/graph">
                        <div className="absolute top-6 left-6 z-10 flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                                Retained (Live)
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Garbage
                            </div>
                        </div>

                        {/* Top Right Metrics Overlay */}
                        <div className="absolute top-6 right-6 z-20 glass bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 w-64 shadow-xl opacity-90">
                            <div className="flex items-center justify-between text-sm font-mono border-b border-slate-800 pb-2 mb-2">
                                <span className="text-slate-400">Total Heap:</span>
                                <span className="text-white font-bold">{formatBytes(memoryHeap.metrics.total)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-mono">
                                <span className="text-slate-400">Used Heap:</span>
                                <span className="text-[#10b981] font-bold">{formatBytes(memoryHeap.metrics.used)}</span>
                            </div>
                            <div className="mt-4">
                                <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[#10b981]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usedPercentage}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Graph Representation */}
                        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
                            {/* SVG Edges */}
                            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                                <AnimatePresence>
                                    {memoryHeap.edges.map(edge => {
                                        const sourcePos = edge.source === 'cs-global' || edge.source === 'ROOT'
                                            ? { x: 50, y: 15 } // Root position
                                            : nodePositions.get(edge.source);

                                        const targetPos = nodePositions.get(edge.target);

                                        if (!sourcePos || !targetPos) return null;

                                        return (
                                            <motion.line
                                                key={`${edge.source}-${edge.target}`}
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 0.4 }}
                                                exit={{ opacity: 0 }}
                                                x1={`${sourcePos.x}%`}
                                                y1={`${sourcePos.y}%`}
                                                x2={`${targetPos.x}%`}
                                                y2={`${targetPos.y}%`}
                                                stroke="#10b981"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                            />
                                        );
                                    })}
                                </AnimatePresence>
                            </svg>

                            {/* Root Node */}
                            <motion.div
                                className="absolute z-10 w-24 h-24 rounded-full border-2 border-[#10b981] bg-[#10b981]/10 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md"
                                style={{ top: '15%', left: '50%', x: '-50%', y: '-50%' }}
                            >
                                <Database className="text-[#10b981] mb-1" size={24} />
                                <span className="text-xs font-bold text-white tracking-widest uppercase">ROOT</span>
                            </motion.div>

                            {/* Allocated Nodes */}
                            <AnimatePresence>
                                {memoryHeap.nodes.map(node => {
                                    const pos = nodePositions.get(node.id) || { x: 50, y: 50 };
                                    const isGarbage = !node.isRetained;

                                    return (
                                        <motion.div
                                            key={node.id}
                                            layoutId={`node-${node.id}`}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                top: `${pos.y}%`,
                                                left: `${pos.x}%`,
                                                x: '-50%',
                                                y: '-50%'
                                            }}
                                            exit={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className={`absolute z-10 px-4 py-2 rounded-xl flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500
                                                ${isGarbage
                                                    ? 'bg-red-500/10 border-2 border-dashed border-red-500/50 grayscale opacity-80'
                                                    : 'bg-[#1e293b]/80 border-2 border-[#10b981]/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] glow'
                                                }`}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isGarbage ? 'text-red-400' : 'text-[#10b981]'}`}>
                                                {node.type}
                                            </span>
                                            <span className={`text-xs font-mono mt-1 ${isGarbage ? 'text-slate-400 strike-through' : 'text-white'}`}>
                                                {node.label}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {memoryHeap.nodes.length === 0 && (
                                <div className="text-center z-0 opacity-50 mt-32">
                                    <p className="text-slate-500 text-sm font-mono">No objects allocated in memory.</p>
                                </div>
                            )}
                        </div>

                        {/* Inspector Drawer */}
                        <AnimatePresence>
                            {isInspectorOpen && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col z-30"
                                >
                                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <Search size={18} className="text-[#10b981]" />
                                            Heap Inspector
                                        </div>
                                        <button
                                            onClick={() => setIsInspectorOpen(false)}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
                                        {memoryHeap.nodes.length === 0 ? (
                                            <div className="text-slate-500 italic text-center mt-10">No allocated nodes.</div>
                                        ) : (
                                            memoryHeap.nodes.map(node => (
                                                <div
                                                    key={node.id}
                                                    className={`p-3 rounded-lg border ${node.isRetained ? 'bg-slate-800/50 border-slate-700' : 'bg-red-500/10 border-red-500/30'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[#0dccf2] font-semibold break-all">{node.id}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${node.isRetained ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-red-500/20 text-red-400'}`}>
                                                            {node.isRetained ? 'Live' : 'Garbage'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-slate-300">
                                                        <div><span className="text-slate-500 mr-2">label:</span>{node.label}</div>
                                                        <div><span className="text-slate-500 mr-2">type:</span><span className="text-amber-300">{node.type}</span></div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
