"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Play, ArrowLeft, CheckCircle2, Code, Layers } from "lucide-react";

export default function DemoPage() {
    const steps = [
        {
            title: "Write Your Code",
            description: "Paste or write your JavaScript directly into our built-in editor. ViSualzzz supports complex asynchronous code, promises, and timeouts.",
            icon: <Code size={28} className="text-[#00BCD4]" />,
            glow: "rgba(0, 188, 212, 0.4)"
        },
        {
            title: "Run the Execution",
            description: "Hit the play button to start the engine. You can control the speed, pause, or step through the execution tick-by-tick using our timeline slider.",
            icon: <Play size={28} className="text-[#00BCD4] ml-1" />,
            glow: "rgba(0, 188, 212, 0.4)"
        },
        {
            title: "Visualize the Engine",
            description: "Watch the magic happen under the hood. See exactly how the V8 engine handles your code as it moves dynamically between the Call Stack, Web APIs, Microtask Queue, and Macrotask Queue.",
            icon: <Layers size={28} className="text-[#00BCD4]" />,
            glow: "rgba(0, 188, 212, 0.4)"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#00BCD4]/30 pb-24 relative overflow-hidden">

            {/* Ambient Backgrounds */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="fixed inset-0 bg-grid-pattern mask-image-gradient opacity-10 pointer-events-none z-0" />

            <nav className="relative z-50 px-6 py-4 flex items-center justify-between border-b border-[#00BCD4]/10 bg-transparent">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    <span className="font-semibold text-sm">Back to Home</span>
                </Link>
                <Link href="/" className="flex items-center gap-2">
                    <Terminal size={24} className="text-[#00BCD4] drop-shadow-[0_0_10px_rgba(0,188,212,0.5)]" />
                    <span className="font-black tracking-tight font-display drop-shadow-md">ViSualzzz <span className="text-slate-500 font-mono text-xs hidden sm:inline">/demo</span></span>
                </Link>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 flex flex-col items-center">

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20 md:mb-32 w-full">
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white mb-6">
                        See How It <span className="text-[#00BCD4] text-glow">Works.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-body">
                        A clean, transparent look into how we rip apart your JavaScript code and expose the inner workings of the V8 engine.
                    </p>
                </motion.div>

                {/* Vertical Timeline Stepper */}
                <div className="relative w-full flex flex-col gap-12 md:gap-24 mb-24 max-w-4xl mx-auto">
                    {/* The Center Line for Desktop, Left Line for Mobile */}
                    <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#00BCD4]/80 via-indigo-500/50 to-transparent -translate-x-1/2 rounded-full hidden sm:block" />

                    {steps.map((step, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 40, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, y: 0, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            key={idx}
                            className={`flex flex-col sm:flex-row items-center justify-between w-full relative group ${idx % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}
                        >
                            {/* Empty space for alternating layout on desktop */}
                            <div className="hidden sm:block sm:w-5/12" />

                            {/* Node / Center circle */}
                            <div className="hidden sm:flex absolute left-6 sm:left-1/2 top-10 sm:top-1/2 sm:-translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0F172A] border-2 border-[#00BCD4] items-center justify-center text-[#00BCD4] font-bold shadow-[0_0_20px_rgba(0,188,212,0.4)] z-10 group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>

                            {/* Content Card */}
                            <div className="w-full sm:w-5/12 pl-16 sm:pl-0 relative">
                                {/* Mobile node connector logic (in absence of center node) */}
                                <div className="sm:hidden absolute left-0 top-6 w-12 h-12 rounded-full bg-[#0F172A] border border-[#00BCD4]/50 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,188,212,0.3)] group-hover:bg-[#00BCD4]/10 transition-colors">
                                    {step.icon}
                                </div>

                                <div className={`w-full bg-[#020617]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-8 flex flex-col relative overflow-hidden transition-all duration-300 shadow-xl group-hover:border-[#00BCD4]/50 hover:-translate-y-1 ${idx % 2 === 0 ? 'sm:text-right sm:items-end' : 'sm:text-left sm:items-start'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00BCD4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className={`text-[#00BCD4]/10 font-black text-7xl font-display select-none absolute -top-4 -z-10 pointer-events-none ${idx % 2 === 0 ? 'sm:-left-4 right-4 sm:right-auto' : 'sm:-right-4 right-4'}`}>
                                        0{idx + 1}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4 font-display relative z-10 tracking-tight">
                                        {step.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed font-body relative z-10">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <Link href="/login" className="px-10 py-5 bg-[#00BCD4] text-[#0F172A] text-xl font-black rounded-xl neon-glow flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,188,212,0.4)]">
                        Try It Yourself <CheckCircle2 size={24} />
                    </Link>
                </motion.div>

            </main>
        </div>
    );
}
