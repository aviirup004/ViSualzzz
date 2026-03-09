"use client";

import Link from "next/link";
import { Terminal, ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function ContactUsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#00BCD4]/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#00BCD4]/20 bg-[#0F172A]/90 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    <span className="font-semibold text-sm">Back to Home</span>
                </Link>
                <Link href="/" className="flex items-center gap-3">
                    <Terminal size={28} className="text-[#00BCD4] drop-shadow-[0_0_10px_rgba(0,188,212,0.5)]" />
                    <span className="text-xl font-black tracking-tight font-display drop-shadow-md">ViSualzzz</span>
                </Link>
                <div className="w-24"></div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left Header & Direct Contact */}
                <div>
                    <h1 className="text-4xl md:text-6xl font-black font-display text-white mb-6">Get in Touch</h1>
                    <p className="text-lg text-slate-400 leading-relaxed mb-12">
                        Have a question about the platform, want to request a feature, or found a bug in the matrix? We'd love to hear from you.
                    </p>

                    <div className="bg-[#020617]/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Mail className="text-[#00BCD4]" size={24} /> Direct Contact
                        </h3>
                        <p className="text-slate-400 mb-2">Reach out directly via email:</p>
                        <a href="mailto:avirupds11@gmail.com" className="text-2xl font-mono text-[#00BCD4] hover:text-white transition-colors inline-block break-all">
                            avirupds11@gmail.com
                        </a>
                        <div className="mt-8 pt-8 border-t border-slate-800">
                            <h4 className="font-bold text-slate-300 mb-2">ViSualzzz Inc.</h4>
                            <p className="text-slate-500 text-sm">Dedicated to illuminating the dark corners of the JavaScript runtime.</p>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="bg-[#020617]/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00BCD4]/10 rounded-full blur-[80px] pointer-events-none" />

                    {isSubmitted ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center mb-6">
                                <Send size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                            <p className="text-slate-400 mb-8 max-w-sm">We've received your transmission and will get back to you as soon as possible.</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[#00BCD4] font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-slate-300">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-slate-300">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-slate-300">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    required
                                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition-all resize-y"
                                    placeholder="Tell us everything..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#00BCD4] text-[#0F172A] text-lg font-black rounded-lg hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,188,212,0.3)] hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Transmitting...' : (
                                    <>Send Message <Send size={20} fill="currentColor" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
