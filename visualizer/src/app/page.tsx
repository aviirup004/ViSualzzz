"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Rocket, BookOpen, Bug, MemoryStick, History, Zap } from "lucide-react";

export default function NextGenLandingPage() {
  const router = useRouter();

  // Mouse Tracking for Global Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  // Parallax scrolling
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Fade out hero title on scroll
  const opacityTitle = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleTitle = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Framer Variants for Staggered Children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-[#0dccf2]/30 font-sans">

      {/* --- FULL PAGE BACKGROUND IMAGE + GLASSMORPHISM OVERLAY --- */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: yBg }}
      >
        {/* The abstract image used as full background */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbpvYOdIPsZVvVaQRpIsNFOlbAPVNaq61EX_mr2be6ljf9Dk5qarPSpPpTOUMxTGZOCN8mPD7WPAEtvdH1Hk0x95nkuVqd5UtZvZgs9D2Yo2G9UNVwteVlyt8uObELdyEZjnWz67vEuWK4ZSLYJCby9lM9X3zy4WOFu4DRlsvULqQfkO1JOTsaW3geMSLyGFqJUvo9kfMRHC4cNuqaHG7KXjgK2udkDwBh7pldjoLbNWFD9ZHMKOEA1_b8FYqjqoTgdJpzhznsbTgs"
          alt="Abstract Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Glassmorphism / Dark Tint over the image */}
        <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xl" />

        {/* Grid Pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern mask-image-gradient opacity-30" />

        {/* Dynamic Mouse Glow */}
        <motion.div
          className="absolute inset-0 z-[-1]"
          style={{
            background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(13, 204, 242, 0.15), transparent 80%)`,
          }}
        />
        {/* Animated Orbs for bluish vibe */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0dccf2] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-700 rounded-full mix-blend-screen filter blur-[180px] opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </motion.div>

      {/* --- NAVBAR --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#0dccf2]/20 bg-[#0F172A]/50 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3">
          <Terminal size={32} className="text-[#0dccf2] drop-shadow-[0_0_10px_rgba(13,204,242,0.5)]" />
          <span className="text-xl font-black tracking-tight font-display drop-shadow-md">ViSualzzz</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          {['Features', 'Docs'].map((item) => (
            <motion.a
              key={item}
              onClick={() => router.push(`/${item.toLowerCase()}`)}
              whileHover={{ scale: 1.1, color: '#0dccf2' }}
              className="text-slate-300 cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={() => router.push("/login")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(13, 204, 242, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-bold text-[#0F172A] bg-[#0dccf2] rounded-lg neon-glow"
          >
            Login
          </motion.button>
        </div>
      </motion.nav>

      {/* --- INITIAL FULL SCREEN TITLE --- */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-16">
        <motion.div
          style={{ opacity: opacityTitle, scale: scaleTitle }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter leading-tight cursor-default flex justify-center text-white"
          >
            {"ViSualzzz".split("").map((letter, i) => (
              <motion.span
                key={i}
                whileHover={{
                  scale: 1.25,
                  color: "#0dccf2",
                  textShadow: "0 0 25px rgba(13,204,242,0.8)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="inline-block hover:z-10 relative"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-6 text-xl text-slate-300 font-mono tracking-widest uppercase"
          >
            The Ultimate Runtime Visualizer
          </motion.p>

          {/* Scroll prompt indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-400 flex flex-col items-center gap-2"
          >
            <span className="text-sm font-mono tracking-widest uppercase">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-400 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* --- CONTENT REVEALED ON SCROLL --- */}
      <main className="relative z-10 flex flex-col items-center px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center py-24 md:py-32"
        >
          {/* Left Column: Dashboard Mockup */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 relative group" style={{ perspective: 1000 }}>
            <div className="absolute -left-4 -top-10 bottom-10 w-1 bg-gradient-to-b from-transparent via-[#0dccf2] to-transparent blur-sm opacity-80" />

            <div className="relative z-10 rounded-2xl overflow-hidden border border-[#0dccf2]/30 shadow-[0_0_50px_-10px_rgba(13,204,242,0.25)] bg-[#0F172A] transform transition-transform hover:scale-[1.02] duration-500 card-neon-border">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-[#0dccf2]/5 z-20 pointer-events-none mix-blend-overlay" />

              <div className="relative w-full aspect-[4/3] bg-[#020617] p-4">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-[#0dccf2]/60 font-mono">dashboard.vsz</div>
                </div>

                <div className="grid grid-cols-3 gap-4 h-full pb-6">
                  <div className="col-span-1 bg-slate-800/50 rounded-lg p-3 border border-cyan-900/50 flex flex-col gap-2">
                    <div className="text-xs text-[#0dccf2] font-mono mb-1">CALL STACK</div>
                    <div className="h-8 bg-red-900/30 border-l-2 border-red-500 rounded px-2 flex items-center text-xs text-red-200 font-mono">verifyUser()</div>
                    <div className="h-8 bg-slate-700/30 rounded px-2 flex items-center text-xs text-slate-400 font-mono">login()</div>
                    <div className="h-8 bg-slate-700/30 rounded px-2 flex items-center text-xs text-slate-400 font-mono">anonymous</div>
                  </div>

                  <div className="col-span-2 bg-slate-800/50 rounded-lg p-3 border border-cyan-900/50 relative overflow-hidden">
                    <div className="text-xs text-[#0dccf2] font-mono mb-2 flex justify-between">
                      <span>EVENT LOOP</span>
                      <span className="animate-pulse text-[#0dccf2]">● LIVE</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Terminal size={120} className="text-[#0dccf2] animate-pulse" />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0dccf2] w-2/3 shadow-[0_0_8px_rgba(13,204,242,0.8)]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full mt-2">
                        <div className="h-16 bg-slate-900/80 rounded border border-cyan-500/30 p-2 shadow-inner">
                          <div className="w-2 h-2 rounded-full bg-[#0dccf2] mb-1 shadow-[0_0_5px_rgba(13,204,242,1)]" />
                          <div className="h-1 w-full bg-slate-700/50 rounded" />
                        </div>
                        <div className="h-16 bg-slate-900/80 rounded border border-cyan-500/30 p-2 shadow-inner">
                          <div className="w-2 h-2 rounded-full bg-[#0dccf2] mb-1 shadow-[0_0_5px_rgba(13,204,242,1)]" />
                          <div className="h-1 w-full bg-slate-700/50 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-[#0dccf2] text-slate-900 font-bold px-4 py-2 rounded-lg text-sm shadow-[0_0_20px_rgba(13,204,242,0.5)] transform rotate-3 z-30 border border-cyan-300">
              System State: CRITICAL
            </div>
          </motion.div>

          {/* Right Column: Descriptions */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left lg:pl-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0dccf2]/40 bg-[#0dccf2]/10 text-[#0dccf2] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_10px_rgba(13,204,242,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#0dccf2] animate-pulse shadow-[0_0_5px_rgba(13,204,242,0.8)]" />
              Reality Check
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-6 text-white text-glow">
              You don&apos;t need a <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 line-through decoration-white/50 decoration-2">debugger.</span>
            </h2>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter mb-8 text-[#0dccf2] text-glow">
              You need an <span className="italic text-cyan-200">exorcist.</span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-10 max-w-lg border-l-4 border-[#0dccf2] pl-6">
              Meet ViSualzzz. The tool that tears open the fabric of your runtime and shows you exactly where your code went to hell.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => router.push("/login")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(13, 204, 242, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0dccf2] text-[#0F172A] font-black rounded-full text-lg neon-glow"
              >
                See the Horror <Rocket size={20} />
              </motion.button>
              <motion.button
                onClick={() => router.push('/demo')}
                whileHover={{ scale: 1.05, borderColor: "rgba(13, 204, 242, 0.8)", backgroundColor: "rgba(13, 204, 242, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[#0dccf2]/30 text-white font-bold rounded-full text-lg transition-colors"
              >
                Interactive Demo <BookOpen size={20} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* --- FEATURES GRID --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 mt-12 border-t border-[#0dccf2]/20">

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0dccf2]/10 border border-[#0dccf2]/20 text-[#0dccf2] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0dccf2] animate-pulse shadow-[0_0_5px_#0dccf2]" />
            Toolkit v2.0
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black font-display mb-6">
            The Visualzzz Toolkit
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-300 text-lg font-body">
            Tools designed for the modern runtime explorer who needs more than just `console.log`.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group glass-panel rounded-2xl p-8 relative overflow-hidden card-neon-border cursor-crosshair transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0dccf2]/10 to-transparent bg-opacity-0 group-hover:bg-opacity-100 transition-all duration-500" />
            <div className="w-14 h-14 rounded-xl bg-[#0dccf2]/10 flex items-center justify-center text-[#0dccf2] mb-6 group-hover:bg-[#0dccf2] group-hover:text-[#0F172A] transition-colors duration-500 shadow-[0_0_15px_rgba(13,204,242,0.2)]">
              <History size={28} />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-3">Time-Travel Debugging</h3>
            <p className="text-slate-300 font-mono text-sm leading-relaxed">
              Go back in time. Fix your mistakes without the butterfly effect. It&apos;s like Ctrl+Z, but for your soul.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group glass-panel rounded-2xl p-8 relative overflow-hidden card-neon-border cursor-crosshair transition-all flex flex-col justify-between">
            <div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0dccf2]/10 to-transparent bg-opacity-0 group-hover:bg-opacity-100 transition-all duration-500" />
              <div className="w-14 h-14 rounded-xl bg-[#0dccf2]/10 flex items-center justify-center text-[#0dccf2] mb-6 group-hover:bg-[#0dccf2] group-hover:text-[#0F172A] transition-colors duration-500 shadow-[0_0_15px_rgba(13,204,242,0.2)]">
                <MemoryStick size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">Memory Sweeper</h3>
              <p className="text-slate-300 font-mono text-sm leading-relaxed">
                A literal laser for your memory leaks. Watch your detached nodes dissolve into the void.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group glass-panel rounded-2xl p-8 relative overflow-hidden card-neon-border cursor-crosshair transition-all flex flex-col justify-between">
            <div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0dccf2]/10 to-transparent bg-opacity-0 group-hover:bg-opacity-100 transition-all duration-500" />
              <div className="w-14 h-14 rounded-xl bg-[#0dccf2]/10 flex items-center justify-center text-[#0dccf2] mb-6 group-hover:bg-[#0dccf2] group-hover:text-[#0F172A] transition-colors duration-500 shadow-[0_0_15px_rgba(13,204,242,0.2)]">
                <Bug size={28} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">Side-Effect Sandbox</h3>
              <p className="text-slate-300 font-mono text-sm leading-relaxed">
                What happens in the sandbox, stays in the sandbox. Play with your DOM without the mess.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="relative z-10 py-24 border-t border-[#0dccf2]/20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-black font-display mb-6">Ready to visualize your code?</h2>
          <p className="text-slate-300 text-lg mb-12 max-w-2xl font-body">Join the thousands of developers who stopped guessing and started seeing the matrix.</p>

          <div className="relative group">
            <div className="absolute inset-0 bg-[#0dccf2] rounded-full blur-[40px] opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 flex items-center gap-3 px-10 py-5 bg-[#0dccf2] text-[#0F172A] text-xl font-black rounded-xl neon-glow"
            >
              Launch Visualizer <Zap size={24} fill="currentColor" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER DOCS --- */}
      <footer className="relative z-10 bg-[#0F172A]/80 backdrop-blur border-t border-[#0dccf2]/20 py-12 px-6 flex flex-col items-center">
        <div className="flex gap-8 mb-8">
          <Link href="/privacy-policy" className="text-slate-400 hover:text-[#0dccf2] font-medium text-sm transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-slate-400 hover:text-[#0dccf2] font-medium text-sm transition-colors">Terms of Service</Link>
          <Link href="/contact-us" className="text-slate-400 hover:text-[#0dccf2] font-medium text-sm transition-colors">Contact Us</Link>
        </div>
        <p className="text-slate-500 text-sm">© 2026 ViSualzzz Inc. All rights reserved.</p>
      </footer>

    </div>
  );
}
