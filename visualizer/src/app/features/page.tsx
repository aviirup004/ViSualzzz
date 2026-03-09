"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Layers, Server, Cpu, Share2, MemoryStick, Play, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeaturesPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Layers size={32} className="text-[#0dccf2]" />,
            title: "Event Loop & Call Stack",
            description: "Watch your code traverse the JavaScript engine in real-time. Understand the exact order of execution across the Call Stack, Microtask queue, and Macrotask queue.",
            glow: "rgba(13,204,242,0.4)"
        },
        {
            icon: <Server size={32} className="text-[#10b981]" />,
            title: "Browser vs. Node.js Toggles",
            description: "Seamlessly switch between Browser execution (Web APIs) and Node.js execution (libuv, C++ APIs, Next Tick queue). Observe the subtle differences in their asynchronous handling.",
            glow: "rgba(16,185,129,0.4)"
        },
        {
            icon: <MemoryStick size={32} className="text-[#fbbf24]" />,
            title: "Memory Heap Profiling",
            description: "Identify memory leaks visually. See your objects on the heap, their references, and when the Garbage Collector reclaims detached nodes.",
            glow: "rgba(251,191,36,0.4)"
        },
        {
            icon: <Share2 size={32} className="text-[#a855f7]" />,
            title: "Snapshot Sharing",
            description: "Save your execution state to the cloud instantly. Generate a unique, shareable URL to send interactive, read-only proof to your colleagues or stack overflow.",
            glow: "rgba(168,85,247,0.4)"
        }
    ];

    return (
        <div className="relative min-h-screen bg-[#0F172A] text-slate-100 overflow-x-hidden font-sans selection:bg-[#0dccf2]/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-pattern mask-image-gradient opacity-10 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0dccf2] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-float pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-50 px-6 py-4 flex items-center justify-between border-b border-[#0dccf2]/20 bg-[#0F172A]/80 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-3">
                    <Terminal size={32} className="text-[#0dccf2] drop-shadow-[0_0_10px_rgba(13,204,242,0.5)]" />
                    <span className="text-xl font-black tracking-tight font-display drop-shadow-md">ViSualzzz</span>
                </Link>
                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <Link href="/features" className="text-[#0dccf2] font-bold">Features</Link>
                    <Link href="/docs" className="text-slate-300 hover:text-[#0dccf2] transition-colors">Docs</Link>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => router.push("/login")} className="px-4 py-2 text-sm font-bold text-[#0F172A] bg-[#0dccf2] rounded-lg neon-glow transition-transform hover:scale-105">
                        Login
                    </button>
                </div>
            </nav>

            {/* Main Hero Header */}
            <header className="relative z-10 py-20 md:py-32 flex flex-col items-center text-center px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-white mb-6">
                        See What Usually <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0dccf2] to-indigo-400">Remains Hidden.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-body">
                        The ultimate runtime visualizer toolkit. Watch your Javascript execute exactly as the V8 engine interprets it.
                    </p>
                </motion.div>
            </header>

            {/* Features Braid */}
            <main className="relative z-10 max-w-6xl mx-auto px-6 pb-32 flex flex-col gap-12 md:gap-24">
                {features.map((feature, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        key={idx}
                        className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
                    >
                        {/* Text Block */}
                        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
                                style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', boxShadow: `0 0 30px ${feature.glow}` }}
                            >
                                {feature.icon}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{feature.title}</h2>
                            <p className="text-slate-300 text-lg leading-relaxed font-body">
                                {feature.description}
                            </p>
                            <Link href="/login" className="mt-8 flex items-center gap-2 text-[#0dccf2] font-bold hover:gap-4 transition-all uppercase tracking-wider text-sm">
                                Try it live <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Abstract Visual Placeholder Block */}
                        <div className="w-full md:w-1/2">
                            <div className="aspect-[4/3] rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="w-32 h-32 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
                                        style={{ borderColor: feature.glow.replace('0.4', '0.8') }}
                                    />
                                    <div
                                        className="absolute w-16 h-16 rounded-lg rotate-45 animate-pulse"
                                        style={{ backgroundColor: feature.glow.replace('0.4', '0.6') }}
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0F172A] to-transparent">
                                    <span className="font-mono text-xs text-slate-400">Module: {feature.title}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </main>

            <footer className="relative z-10 border-t border-[#0dccf2]/20 py-12 text-center text-slate-500 text-sm">
                © 2026 ViSualzzz Inc. All rights reserved.
            </footer>
        </div>
    );
}
