"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Twitter, X as CloseIcon } from "lucide-react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
            setShowToast(false);
        }
    }, [isOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setShowToast(true);

            setTimeout(() => {
                setCopied(false);
                setShowToast(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleTwitterShare = () => {
        const text = encodeURIComponent("Check out how the V8 engine executes this JavaScript under the hood! 🤯 Built with ViSualzzz.");
        const url = encodeURIComponent(shareUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#020617] border border-[#00BCD4]/30 rounded-2xl shadow-[0_0_40px_rgba(0,188,212,0.15)] z-[101] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white font-display">Share Snapshot</h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <p className="text-slate-400 text-sm">
                                Your execution snapshot has been securely saved to the cloud. Share this link to show others your exact V8 engine state.
                            </p>

                            {/* URL Box */}
                            <div className="flex items-center gap-2 bg-[#0F172A] p-2 rounded-lg border border-slate-800">
                                <div className="flex-1 truncate px-2 font-mono text-sm text-[#00BCD4]">
                                    {shareUrl}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${copied
                                            ? 'bg-[#10b981] text-[#0F172A]'
                                            : 'bg-slate-800 text-white hover:bg-slate-700'
                                        }`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-800"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-[#020617] px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Or share on</span>
                                </div>
                            </div>

                            {/* Twitter Button */}
                            <button
                                onClick={handleTwitterShare}
                                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 border border-slate-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:border-[#00BCD4]/30 group"
                            >
                                <Twitter size={20} className="text-white group-hover:text-[#00BCD4] transition-colors" />
                                Share to X (Twitter)
                            </button>
                        </div>
                    </motion.div>

                    {/* Toast Notification */}
                    <AnimatePresence>
                        {showToast && (
                            <motion.div
                                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] z-[102] backdrop-blur-md font-bold text-sm"
                            >
                                <Check size={18} />
                                Link copied to clipboard!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
