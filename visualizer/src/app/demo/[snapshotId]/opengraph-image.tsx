import { ImageResponse } from 'next/og';
import { getSnippetSnapshot } from '@/lib/firebase';

export const alt = 'ViSualzzz Execution Snapshot';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

function highlightLine(line: string) {
    const tokens = line.split(/(\bfunction\b|\bconst\b|\blet\b|\bvar\b|\basync\b|\bawait\b|\breturn\b|\bnew\b|\bsetTimeout\b|\bconsole\b|\blog\b|\bPromise\b|\bresolve\b|\bthen\b|\bfetch\b)/g);
    return tokens.map((token, i) => {
        if (!token) return null;
        if (['function', 'const', 'let', 'var', 'async', 'await', 'return', 'new'].includes(token)) {
            return <span key={i} style={{ color: '#00BCD4', fontWeight: 'bold' }}>{token}</span>; // Cyan
        }
        if (['setTimeout', 'console', 'log', 'Promise', 'resolve', 'then', 'fetch'].includes(token)) {
            return <span key={i} style={{ color: '#fef08a' }}>{token}</span>; // Pale Yellow
        }
        return <span key={i} style={{ color: '#e2e8f0' }}>{token}</span>; // Light gray
    });
}

export default async function Image({ params }: { params: Promise<{ snapshotId: string }> }) {
    const resolvedParams = await params;
    const { snapshotId } = resolvedParams;
    let snippetParams = null;

    try {
        if (snapshotId) {
            snippetParams = await getSnippetSnapshot(snapshotId);
        }
    } catch (e) {
        console.error("OG Image fetching error:", e);
    }

    const hasSnippet = !!(snippetParams && snippetParams.codeSnippet);
    const rawLines = hasSnippet ? snippetParams.codeSnippet.split('\n') : [];
    const displayLines = rawLines.slice(0, 10);
    const hasMore = rawLines.length > 10;

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0F172A', // Deep navy
                    padding: '60px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Logo Area */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', color: '#00BCD4', fontSize: 56, fontWeight: '800', marginRight: '16px' }}>
                        &gt;_
                    </div>
                    <div style={{ display: 'flex', color: 'white', fontSize: 56, fontWeight: '800', letterSpacing: '-0.05em' }}>
                        ViSualzzz
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        backgroundColor: '#020617', // Darker code background
                        border: '2px solid rgba(0, 188, 212, 0.2)',
                        borderRadius: '24px',
                        padding: '40px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Fake Editor controls */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#eab308' }} />
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#10b981' }} />
                    </div>

                    {hasSnippet ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {displayLines.map((line: string, i: number) => (
                                <div key={i} style={{ display: 'flex', fontSize: 32, lineHeight: 1.6, fontFamily: 'monospace', whiteSpace: 'pre' }}>
                                    <div style={{ display: 'flex', color: '#475569', minWidth: '40px', marginRight: '24px', userSelect: 'none' }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ display: 'flex', color: '#e2e8f0', whiteSpace: 'pre' }}>
                                        {highlightLine(line)}
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.6, fontFamily: 'monospace', whiteSpace: 'pre' }}>
                                    <div style={{ display: 'flex', color: '#475569', minWidth: '40px', marginRight: '24px', userSelect: 'none' }}>
                                        {displayLines.length + 1}
                                    </div>
                                    <div style={{ display: 'flex', color: '#00BCD4', fontStyle: 'italic', whiteSpace: 'pre' }}>
                                        ...
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', color: '#00BCD4', fontSize: 48, fontWeight: '700', textAlign: 'center', marginBottom: '20px' }}>
                                Visualize JavaScript execution.
                            </div>
                            <div style={{ display: 'flex', color: '#64748b', fontSize: 32, fontWeight: '500', textAlign: 'center' }}>
                                View how V8 Call Stack & Memory Heap works under the hood.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
