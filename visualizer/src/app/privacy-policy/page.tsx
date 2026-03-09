"use client";

import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                <div className="w-24"></div> {/* Spacer for center alignment */}
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20 pb-32">
                <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-6">Privacy Policy</h1>
                <p className="text-slate-400 mb-12">Last Updated: March 2026</p>

                <div className="prose prose-invert prose-cyan max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-slate-300 leading-relaxed">
                            ViSualzzz Inc. ("we", "our", or "us") collects information you provide directly to us when you use our platform. This includes personal information such as your name, email address, and authentication data when you create an account, as well as any feedback or communications you send to us. We also automatically collect certain telemetry data, including IP addresses, browser types, and usage patterns to optimize the visualizer engine's performance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                        <p className="text-slate-300 leading-relaxed">
                            We use the collected data to provide, maintain, and improve the ViSualzzz platform. Specifically, we use your information to authenticate your access, securely store your dashboard settings, process your requests, and send technical notices or administrative messages. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User-Submitted Code Snippets</h2>
                        <p className="text-slate-300 leading-relaxed">
                            As a developer visualization tool, you may input or paste JavaScript code snippets into our built-in editor. <strong>Code snippets evaluated in the standard dashboard run locally in your browser context.</strong> However, if you explicitly utilize the "Snapshot Sharing" feature, your code snippet, selected environment toggle, and active memory heap state will be transmitted and stored securely in our cloud database to generate a shareable URL. We do not inspect, claim ownership of, or use your proprietary code for any purpose other than providing the Snapshot feature. You are responsible for ensuring you do not share sensitive credentials, API keys, or proprietary secrets in your code snippets.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p className="text-slate-300 leading-relaxed">
                            We implement commercially reasonable technical and organizational measures to protect your data against unauthorized access, destruction, or alteration. While we strive to use enterprise-grade security to protect your account and snapshot data, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                        <p className="text-slate-300 leading-relaxed">
                            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us directly at:
                            <br />
                            <a href="mailto:avirupds11@gmail.com" className="text-[#00BCD4] hover:underline mt-2 inline-block">avirupds11@gmail.com</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
