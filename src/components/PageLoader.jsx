export default function PageLoader({ label = 'Loading' }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-void)',
                color: 'var(--text-hero)',
                padding: '2rem',
            }}
        >
            <div style={{ width: 'min(280px, 80vw)' }}>
                <div
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        color: 'var(--text-muted)',
                        marginBottom: '0.75rem',
                    }}
                >
                    {label.toUpperCase()}
                </div>
                <div
                    style={{
                        position: 'relative',
                        height: '3px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '35%',
                            borderRadius: '999px',
                            background: 'linear-gradient(90deg, var(--accent), #F5A87A)',
                            animation: 'page-loader-sweep 1.1s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
            <style>{`
                @keyframes page-loader-sweep {
                    0% { transform: translateX(-120%); }
                    100% { transform: translateX(320%); }
                }
            `}</style>
        </div>
    );
}
