"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an external service
        console.error(error);
    }, [error]);

    return (
        <div className="flex bg-[#0F172A] w-full h-[100vh] items-center justify-center p-8 text-white font-mono break-words overflow-y-auto">
            <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl max-w-4xl shadow-2xl space-y-4">
                <h2 className="text-2xl font-bold text-red-400">🚨 Application Crashed!</h2>
                <p>Something went wrong during the React render tree execution.</p>
                <div className="bg-black/50 p-4 rounded text-sm text-red-300 font-mono whitespace-pre-wrap overflow-x-auto">
                    <p className="font-bold border-b border-red-500/30 pb-2 mb-2">Error Message:</p>
                    {error.name}: {error.message}

                    <p className="font-bold border-b border-red-500/30 pb-2 mb-2 mt-4">Stack Trace:</p>
                    {error.stack || "No stack trace available"}
                </div>
                <button
                    onClick={() => reset()}
                    className="bg-red-500 hover:bg-red-400 text-black font-bold py-2 px-4 rounded transition-colors"
                >
                    Try again to bypass this specific crash
                </button>
            </div>
        </div>
    );
}
