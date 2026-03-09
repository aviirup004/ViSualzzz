"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, PlusCircle, ArrowLeft } from "lucide-react";
import { getSnippetSnapshot } from "@/lib/firebase";
import { useEngineStore } from "@/store/useEngineStore";
// Import the main Dashboard component instead of recreating it
import DashboardLayout from "@/app/dashboard/page";

export default function DemoSnapshotPage() {
    const params = useParams();
    const router = useRouter();
    const snapshotId = params.snapshotId as string;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Grab exactly what we need from the global state store
    const { setCodeSnippet, setEnvironment } = useEngineStore();

    useEffect(() => {
        let isMounted = true;

        async function fetchSnapshot() {
            if (!snapshotId) return;
            try {
                // Fetch using our imported Firebase v9 function
                const snapshot = await getSnippetSnapshot(snapshotId);

                if (snapshot && isMounted) {
                    // Populate our robust Zustand slice state 
                    setCodeSnippet(snapshot.codeSnippet || "");

                    // Note: Use 'browser' or 'node' to match ViSualzzz environments
                    const activeEnv = snapshot.environment === "node" ? "node" : "browser";
                    setEnvironment(activeEnv);

                    // Turn off loading once everything is structurally populated
                    setLoading(false);
                } else if (isMounted) {
                    setNotFound(true);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching demo snapshot:", err);
                if (isMounted) {
                    setNotFound(true);
                    setLoading(false);
                }
            }
        }

        fetchSnapshot();

        return () => {
            isMounted = false;
        };
    }, [snapshotId, setCodeSnippet, setEnvironment]);

    // UI Handle: Data Fetching State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center font-sans">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#00BCD4] rounded-full blur-[30px] opacity-40 animate-pulse" />
                    <Loader2 size={64} className="text-[#00BCD4] animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-black tracking-widest uppercase font-display text-white shadow-[0_0_10px_rgba(0,188,212,0.5)]">
                    Initializing Engine State
                </h2>
                <p className="text-slate-400 mt-2 font-mono text-sm tracking-tight text-center max-w-sm">Fetching immutable code execution instructions and memory heap data from the cloud...</p>
            </div>
        );
    }

    // UI Handle: 404 Missing State
    if (notFound) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center font-sans p-6">
                <AlertCircle size={80} className="text-red-500 mb-8 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <h1 className="text-5xl font-black mb-4 font-display text-white text-center">Snippet not found <br />or has been removed.</h1>
                <p className="text-slate-400 mb-10 max-w-md text-center text-lg leading-relaxed">
                    The dynamic execution snippet you are looking for does not exist in our system. It may have been deleted or the URL is invalid.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard" className="bg-[#00BCD4] text-[#0F172A] px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,188,212,0.4)]">
                        <PlusCircle size={24} /> Create a New Snippet
                    </Link>
                    <Link href="/" className="bg-transparent border border-slate-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // UI Handle: Full Success Route
    // We render the full dashboard here since our global state has been successfully populated!
    // This allows the user to immediately engage with the ViSualzzz emulator.
    return <DashboardLayout />;
}
