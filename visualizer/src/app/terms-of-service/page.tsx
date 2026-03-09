"use client";

import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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

            <main className="max-w-4xl mx-auto px-6 py-20 pb-32">
                <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-6">Terms of Service</h1>
                <p className="text-slate-400 mb-12">Last Updated: March 2026</p>

                <div className="prose prose-invert prose-cyan max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-300 leading-relaxed">
                            By accessing or using the ViSualzzz platform ("Service") provided by ViSualzzz Inc., you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Conduct</h2>
                        <p className="text-slate-300 leading-relaxed">
                            You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-4">
                            <li>Using the platform in any way that violates any applicable national or international law or regulation.</li>
                            <li>Attempting to interfere with, disrupt, or exploit the integrity or performance of the ViSualzzz V8 emulation engine or underlying infrastructure.</li>
                            <li>Using the "Snapshot Sharing" feature to distribute malware, malicious scripts, or unlawful content.</li>
                            <li>Attempting to gain unauthorized access to other users' accounts or private snapshots.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
                        <p className="text-slate-300 leading-relaxed">
                            The ViSualzzz platform, including its original content, features, visual design, and proprietary JS engine visualization logic, is owned by ViSualzzz Inc. and is protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You retain full ownership and intellectual property rights to any code snippets you write or paste into the editor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                        <p className="text-slate-300 leading-relaxed">
                            In no event shall ViSualzzz Inc., its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any errors or inaccuracies in the engine visualization execution; and (iv) unauthorized access, use or alteration of your transmissions or content. The tool is provided "AS IS" for educational and debugging visualization purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Questions about the Terms of Service should be sent to us at:
                            <br />
                            <a href="mailto:avirupds11@gmail.com" className="text-[#00BCD4] hover:underline mt-2 inline-block">avirupds11@gmail.com</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
