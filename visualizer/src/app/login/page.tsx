"use client";

import { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Lock, Mail, ArrowRight, User } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);

    // Mouse Tracking for Global Glow
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate authentication
        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
    };

    return (
        <div className="relative min-h-screen text-slate-100 overflow-hidden selection:bg-[#0dccf2]/30 font-sans flex items-center justify-center p-6">

            {/* --- FULL PAGE BACKGROUND IMAGE + GLASSMORPHISM OVERLAY --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* The abstract image used as full background */}
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbpvYOdIPsZVvVaQRpIsNFOlbAPVNaq61EX_mr2be6ljf9Dk5qarPSpPpTOUMxTGZOCN8mPD7WPAEtvdH1Hk0x95nkuVqd5UtZvZgs9D2Yo2G9UNVwteVlyt8uObELdyEZjnWz67vEuWK4ZSLYJCby9lM9X3zy4WOFu4DRlsvULqQfkO1JOTsaW3geMSLyGFqJUvo9kfMRHC4cNuqaHG7KXjgK2udkDwBh7pldjoLbNWFD9ZHMKOEA1_b8FYqjqoTgdJpzhznsbTgs"
                    alt="Abstract Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                {/* Glassmorphism / Dark Tint over the image */}
                <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-2xl" />

                {/* Grid Pattern overlay */}
                <div className="absolute inset-0 bg-grid-pattern mask-image-gradient opacity-30" />

                {/* Dynamic Mouse Glow */}
                <motion.div
                    className="absolute inset-0 z-[-1]"
                    style={{
                        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(13, 204, 242, 0.15), transparent 80%)`,
                    }}
                />
                {/* Animated Orbs for bluish vibe */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0dccf2] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-700 rounded-full mix-blend-screen filter blur-[180px] opacity-20 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* --- TOP LEFT BRANDING --- */}
            <Link href="/" className="fixed top-6 left-6 z-50 flex items-center gap-3 group">
                <Terminal size={32} className="text-[#0dccf2] drop-shadow-[0_0_10px_rgba(13,204,242,0.5)] group-hover:scale-110 transition-transform" />
                <span className="text-xl font-black tracking-tight font-display drop-shadow-md text-white group-hover:text-[#0dccf2] transition-colors">
                    ViSualzzz
                </span>
            </Link>

            {/* --- AUTHENTICATION CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-8 border border-[#0dccf2]/30 shadow-[0_0_40px_rgba(13,204,242,0.1)] card-neon-border"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0dccf2] rounded-full blur-[80px] opacity-20 pointer-events-none" />

                <div className="text-center mb-8">
                    <motion.h2
                        key={isLogin ? "login-title" : "signup-title"}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black font-display text-white mb-2"
                    >
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </motion.h2>
                    <p className="text-slate-400 text-sm font-mono tracking-wide">
                        {isLogin ? "Enter your coordinates to continue" : "Initialize a new developer profile"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">

                    <motion.div
                        initial={false}
                        animate={{ height: isLogin ? 0 : "auto", opacity: isLogin ? 0 : 1 }}
                        className="overflow-hidden"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0dccf2] transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full bg-[#0F172A]/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0dccf2] focus:ring-1 focus:ring-[#0dccf2] transition-all shadow-inner"
                            />
                        </div>
                    </motion.div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0dccf2] transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            className="w-full bg-[#0F172A]/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0dccf2] focus:ring-1 focus:ring-[#0dccf2] transition-all shadow-inner"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0dccf2] transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full bg-[#0F172A]/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0dccf2] focus:ring-1 focus:ring-[#0dccf2] transition-all shadow-inner"
                        />
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <a href="#" className="text-xs text-[#0dccf2] hover:text-white transition-colors">Forgot protocol?</a>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(13, 204, 242, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-[#0dccf2] text-[#0F172A] text-base font-bold rounded-xl transition-all neon-glow"
                    >
                        {isLogin ? "Execute Login" : "Initialize Account"}
                        <ArrowRight size={18} />
                    </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center relative z-10">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "No coordinates yet?" : "Already initialized?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#0dccf2] font-bold tracking-wide hover:text-white transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
