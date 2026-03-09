"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Book, Code, MemoryStick, Share2, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DocsPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("getting-started");

    const sections = [
        { id: "getting-started", title: "Getting Started", icon: <Book size={18} /> },
        { id: "call-stack", title: "Understanding the Call Stack", icon: <Code size={18} /> },
        { id: "memory-management", title: "Memory Management", icon: <MemoryStick size={18} /> },
        { id: "sharing-snapshots", title: "Sharing Snapshots", icon: <Share2 size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col selection:bg-[#0dccf2]/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#0dccf2]/20 bg-[#0F172A]/90 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-[#0dccf2]" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link href="/" className="flex items-center gap-3">
                        <Terminal size={28} className="text-[#0dccf2] drop-shadow-[0_0_10px_rgba(13,204,242,0.5)]" />
                        <span className="text-xl font-black tracking-tight font-display drop-shadow-md">ViSualzzz <span className="text-slate-500 font-mono text-xs hidden sm:inline">/docs</span></span>
                    </Link>
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <Link href="/features" className="text-slate-300 hover:text-[#0dccf2] transition-colors">Features</Link>
                    <Link href="/docs" className="text-[#0dccf2] font-bold">Docs</Link>
                </div>

                <button onClick={() => router.push("/login")} className="hidden sm:block px-4 py-2 text-xs font-bold text-[#0dccf2] border border-[#0dccf2]/30 bg-[#0dccf2]/10 rounded-lg shadow-sm hover:bg-[#0dccf2]/20 transition-all">
                    Login
                </button>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-slate-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0 mt-[73px]' : '-translate-x-full'}`}
                >
                    <div className="h-full px-4 py-8 overflow-y-auto">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Documentation</h4>
                        <ul className="space-y-2">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => { setActiveSection(section.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.id ? 'bg-[#0dccf2]/10 text-[#0dccf2] border border-[#0dccf2]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
                                    >
                                        <span className={activeSection === section.id ? 'text-[#0dccf2]' : 'text-slate-500'}>{section.icon}</span>
                                        {section.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full md:max-w-4xl mx-auto p-6 md:p-12 lg:p-20 relative">
                    {/* Glowing BG effect */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#0dccf2]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

                    <div className="prose prose-invert prose-cyan max-w-none">

                        {/* Getting Started */}
                        {activeSection === "getting-started" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-4xl font-black font-display text-white mb-6">Getting Started with ViSualzzz</h1>
                                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                    ViSualzzz is an advanced runtime debugging tool designed to illuminate the inner workings of JavaScript execution environments.
                                    Whether you're struggling with asynchronous callbacks or analyzing garbage collection loops, ViSualzzz maps it visually in an intuitive, frame-by-frame engine.
                                </p>

                                <h3 className="text-2xl font-bold font-display text-white mt-10 mb-4 border-b border-slate-800 pb-2">Browser vs. Node.js Toggles</h3>
                                <p className="text-slate-300 mb-4">
                                    JavaScript runs differently depending on its host environment. The top navigation provides an instant toggle to swap the execution context.
                                </p>
                                <ul className="list-disc pl-6 space-y-3 text-slate-300 mb-8">
                                    <li><strong>Browser Mode:</strong> Simulates standard Web APIs like <code className="bg-slate-800 px-1 py-0.5 rounded text-[#0dccf2]">setTimeout</code> and <code className="bg-slate-800 px-1 py-0.5 rounded text-[#0dccf2]">fetch</code>. This leverages the traditional Macro and Microtask queues.</li>
                                    <li><strong>Node.js Mode:</strong> Emulates the Libuv library and C++ bindings, emphasizing the nuanced <code className="bg-slate-800 px-1 py-0.5 rounded text-red-500">process.nextTick()</code> queue which takes precedence over all other asynchronous operations.</li>
                                </ul>

                                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 mt-8">
                                    <h4 className="text-[#0dccf2] font-bold mb-2 flex items-center gap-2">
                                        <ArrowRight size={16} /> Ready to jump in?
                                    </h4>
                                    <p className="text-sm text-slate-400">Head over to the <Link href="/dashboard" className="text-indigo-400 hover:underline">Dashboard</Link> and write your first script in the editor!</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Understanding the Call Stack */}
                        {activeSection === "call-stack" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-4xl font-black font-display text-white mb-6">Understanding the Call Stack</h1>
                                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                    JavaScript is a single-threaded language, meaning it has only one Call Stack and executes one thing at a time. The Call Stack is a data structure that records where we are in our program.
                                </p>

                                <div className="bg-[#020617] border border-slate-800 rounded-lg p-6 mb-8 shadow-inner">
                                    <h4 className="font-mono text-xs text-slate-500 mb-4">MOCK CALL STACK</h4>
                                    <div className="flex justify-center">
                                        <div className="w-64 border border-[#0dccf2]/30 rounded-lg p-2 bg-[#0F172A] flex flex-col-reverse gap-2">
                                            <div className="border border-red-500/50 bg-red-500/10 p-2 rounded text-center font-mono text-xs text-red-400">throwError()</div>
                                            <div className="border border-slate-700 bg-slate-800 p-2 rounded text-center font-mono text-xs text-slate-300">init()</div>
                                            <div className="border border-slate-700 bg-slate-800 p-2 rounded text-center font-mono text-xs text-slate-300">anonymous global</div>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-slate-500 mt-4 italic">Frames are pushed to the top and popped off when complete.</p>
                                </div>

                                <h3 className="text-2xl font-bold font-display text-white mt-10 mb-4 border-b border-slate-800 pb-2">The Engine Controls</h3>
                                <p className="text-slate-300 mb-4">
                                    Below the editor, use the scrubber and playback controls to step through the execution:
                                </p>
                                <ul className="list-disc pl-6 space-y-3 text-slate-300">
                                    <li><strong>Line Step vs. Tick Step:</strong> Choose whether navigating forces the engine to push to the next line of written code, or granularly steps through every internal engine tick.</li>
                                    <li><strong>Code Highlighting:</strong> The active line evaluating on the stack will highlight aggressively in <span className="text-[#0dccf2]">Cyan</span> colors in the editor.</li>
                                </ul>
                            </motion.div>
                        )}

                        {/* Memory Management */}
                        {activeSection === "memory-management" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-4xl font-black font-display text-white mb-6">Memory Heap Profiling</h1>
                                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                    Memory allocation in JavaScript occurs in the Memory Heap. This is a largely unstructured region of memory where objects and variables are stored. ViSualzzz simulates primitive reference counting and mark-and-sweep garbage collection algorithms.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 mt-10">
                                    <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/50">
                                        <MemoryStick className="text-[#10b981] mb-4" size={32} />
                                        <h4 className="font-bold text-white mb-2">Memory Accumulation</h4>
                                        <p className="text-sm text-slate-400">Defining variables forces pointers to allocate blocks inside the Memory Box overlay on your dashboard.</p>
                                    </div>
                                    <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/50">
                                        <Terminal className="text-orange-400 mb-4" size={32} />
                                        <h4 className="font-bold text-white mb-2">Garbage Collection</h4>
                                        <p className="text-sm text-slate-400">Nodes that become detached from the global context root are automatically swept when their reference drops to zero.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Sharing Snapshots */}
                        {activeSection === "sharing-snapshots" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-4xl font-black font-display text-white mb-6">Sharing Snapshots</h1>
                                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                    Need to show a coworker exactly why a promise chain is failing? You can take a cloud-hosted snapshot of your active editor and timeline using the Snapshot feature.
                                </p>

                                <div className="border border-[#0dccf2]/30 bg-[#0dccf2]/5 rounded-xl p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-[#0dccf2]/20 flex items-center justify-center text-[#0dccf2] flex-shrink-0">
                                        <Share2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Generating a Shared Link</h3>
                                        <p className="text-slate-300 text-sm">
                                            Click the explicit blue <strong className="text-[#0dccf2]">Snapshot</strong> button in the top right of your dashboard screen. Wait for the green success checkmark to pulse. A secure unique link is automatically copied to your clipboard!
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold font-display text-white mt-8 mb-4">View-Only Environments</h3>
                                <p className="text-slate-300 mb-4">
                                    The receiver of a snapshot link will be navigated to a sterile, interactive, but strictly <strong>read-only container</strong> representing the exact state (Browser vs. Node.js environment selected, code, layout) you saw at creation. Edits are physically disabled to prevent overwriting evidence!
                                </p>
                            </motion.div>
                        )}

                    </div>
                </main>
            </div>

        </div>
    );
}
