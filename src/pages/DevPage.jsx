import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY = {
    id: 'dev',
    title: '개발',
    en: 'DEVELOPMENT',
    desc: '웹 애플리케이션, 자동화 도구, AI 통합 서비스. 아이디어를 실제 프로덕트로 구현합니다.',
    color: '#5DB8A8', // mint tone
};

const PROJECTS = [
    {
        title: '우주 대스타 (Cosmic Superstar)',
        type: 'Unity / Kinect v2',
        desc: '고양 스타필드 매직플로우 체험존. Kinect v2의 깊이와 가속도 데이터를 정밀 제어하여 사용자를 실시간 미러링하는 인터랙티브 XR 서비스.',
        url: 'https://youtu.be/N-MJOCrLh0A', // Placeholder link
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Deep Purple
        textColor: '#fff'
    },
    {
        title: 'Paper Prism',
        type: 'AI Tool',
        desc: 'AI 기반 논문 이미지 추출 도구. Hugging Face Spaces 배포.',
        url: 'https://huggingface.co/spaces/notoow/paper-image-extractor',
        color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
        textColor: '#333'
    },
    {
        title: 'Vietls',
        type: 'Web Service',
        desc: '영상 편집 효율화 툴. 자막 및 프리미어 프로 워크플로우 최적화.',
        url: 'http://vietls.com',
        color: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        textColor: '#004d40'
    },
    {
        title: 'Hanjul',
        type: 'Python Service',
        desc: '파이썬 기반 텍스트/데이터 처리 서비스.',
        url: 'https://hanjul.pythonanywhere.com/',
        color: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        textColor: '#37474f'
    },
    {
        title: 'Local Guides Leaderboard',
        type: 'Dashboard',
        desc: 'Google Maps Local Guides 랭킹 및 통계 대시보드.',
        url: 'https://notoow.github.io/google-maps-local-guides-leaderboards/index.html',
        color: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
        textColor: '#004d40'
    },
];

const MANIFESTO = [
    {
        title: "1. Don't Reinvent the Wheel",
        desc: "바퀴를 새로 발명하지 마라. 이미 잘 만들어진 오픈소스나 클론 코딩 프로젝트를 먼저 찾아 학습시키고, 리버스 엔지니어링을 통해 로직을 분석합니다."
    },
    {
        title: "2. 1,500 Lines Limit",
        desc: "파일이 2,000줄에 가까워지면 AI가 맥락을 잃기 쉽습니다. 1,500줄을 절대 넘기지 않도록 엄격한 모듈화를 강제하여 유지보수성을 높입니다."
    },
    {
        title: "3. SSoT & DRY Principles",
        desc: "Single Source of Truth와 Don't Repeat Yourself 원칙을 반복적으로 주지시켜 중복 코드를 방지하고 데이터의 정합성을 지킵니다."
    },
    {
        title: "4. Backup & Cross-Check",
        desc: "대규모 리팩토링 전에는 반드시 .bak 파일을 생성하고, Claude의 설계를 Gemini나 GPT-4o에게 교차 검증받아 놓친 부분을 보완합니다."
    },
    {
        title: "5. Structured Naming",
        desc: "[도메인/위치]-[대상]-[동작] 구조(예: YouTubeChannelConnectButton)의 명칭을 사용하여 디버깅 시간을 획기적으로 줄입니다."
    },
    {
        title: "6. Test Environment",
        desc: "메인 페이지를 바로 수정하지 않고, /test 경로에서 새로운 UI나 로직을 마음껏 실험한 뒤 검증된 기능만 이식합니다."
    }
];

function ProjectCard({ item, index }) {
    const [hover, setHover] = useState(false);

    return (
        <motion.a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'block',
                textDecoration: 'none',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '16/10',
                background: item.color || '#222',
                boxShadow: hover ? '0 20px 50px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                transform: hover ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
                cursor: 'pointer',
            }}
        >
            <div style={{
                padding: '2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: item.textColor || '#fff',
            }}>
                <div>
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        opacity: 0.7,
                        textTransform: 'uppercase',
                        border: `1px solid ${item.textColor || '#fff'}`,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                    }}>{item.type}</span>
                    <h3 style={{
                        marginTop: '1rem',
                        fontFamily: 'var(--font-en)',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        lineHeight: 1.1,
                    }}>{item.title}</h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.8,
                        maxWidth: '80%',
                        lineHeight: 1.5,
                        fontFamily: 'var(--font-kr)',
                    }}>{item.desc}</p>

                    <div style={{
                        width: '40px', height: '40px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(5px)',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Grain overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
                opacity: 0.4, pointerEvents: 'none', mixBlendMode: 'overlay',
            }} />
        </motion.a>
    );
}

function ManifestoSection() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section style={{
            marginTop: '8rem',
            padding: '4rem 3rem',
            background: '#111',
            borderTop: '1px solid #222',
            borderBottom: '1px solid #222',
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: CATEGORY.color, letterSpacing: '0.15em'
                    }}>ENGINEERING PHILOSOPHY</span>
                    <h2 style={{
                        fontSize: '2.5rem', fontFamily: 'var(--font-kr)', fontWeight: 700,
                        marginTop: '1rem', color: '#fff',
                    }}>
                        영상 제작사의 기술 혁신,<br />
                        <span style={{ color: '#888' }}>생산성 10배의 법칙.</span>
                    </h2>
                    <p style={{ marginTop: '1.5rem', color: '#999', lineHeight: 1.7, maxWidth: '700px' }}>
                        비개발자였던 제가 어떻게 클로드(Claude)와 함께 영상 제작 프로세스의 효율을 10배 이상 끌어올렸는지,<br />
                        그리고 그 과정에서 얻은 <strong>'바이브 코딩 6계명'</strong>을 소개합니다.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {MANIFESTO.map((item, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{
                                    width: '100%', textAlign: 'left', background: 'transparent',
                                    border: 'none', padding: '1rem 0', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}
                            >
                                <span style={{
                                    fontFamily: 'var(--font-en)', fontSize: '1.2rem', fontWeight: 600,
                                    color: openIndex === i ? CATEGORY.color : '#eee',
                                    transition: 'color 0.3s'
                                }}>{item.title}</span>
                                <span style={{ color: '#555', fontSize: '1.5rem' }}>{openIndex === i ? '−' : '+'}</span>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <p style={{
                                            paddingBottom: '1.5rem', color: '#aaa', lineHeight: 1.6,
                                            fontFamily: 'var(--font-kr)', fontSize: '0.95rem'
                                        }}>
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function DevPage() {
    return (
        <div style={{
            background: 'var(--bg-void)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-kr)', minHeight: '100vh',
            paddingBottom: '5rem',
        }}>
            {/* ─── TOP NAV ─── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0.8rem 3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(2,2,2,0.85)',
                backdropFilter: 'blur(24px) saturate(1.5)',
                borderBottom: '1px solid var(--border)',
            }}>
                <a href="#interactive" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textDecoration: 'none', transition: 'color 0.3s',
                }}>← BACK</a>
                <span style={{ fontFamily: 'var(--font-en)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-hero)' }}>
                    notoow<span style={{ color: 'var(--accent)' }}>.</span>
                </span>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: CATEGORY.color, letterSpacing: '0.15em',
                }}>{CATEGORY.en}</span>
            </nav>

            {/* ─── HERO ─── */}
            <section style={{
                height: '45vh', minHeight: '350px',
                display: 'flex', alignItems: 'flex-end',
                padding: '0 3rem 4rem', position: 'relative', overflow: 'hidden',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', top: '10%', right: '10%',
                    width: '600px', height: '600px',
                    background: `radial-gradient(circle, ${CATEGORY.color}15, transparent 65%)`,
                    filter: 'blur(100px)', pointerEvents: 'none',
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}
                >
                    <div style={{
                        display: 'inline-flex', gap: '0.6rem', alignItems: 'center',
                        marginBottom: '1.5rem',
                    }}>
                        <span style={{
                            width: '28px', height: '2px',
                            background: CATEGORY.color, display: 'inline-block',
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: CATEGORY.color, letterSpacing: '0.15em',
                        }}>{CATEGORY.en}</span>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-kr)',
                        fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                        fontWeight: 800, lineHeight: 1.1,
                        letterSpacing: '-0.03em', marginBottom: '1.2rem',
                    }}>
                        {CATEGORY.title}
                        <span style={{ color: CATEGORY.color }}>.</span>
                    </h1>

                    <p style={{
                        fontSize: '1rem', lineHeight: 1.75,
                        color: 'var(--text-secondary)', maxWidth: '520px',
                    }}>{CATEGORY.desc}</p>
                </motion.div>
            </section>

            {/* ─── PROJECT GRID ─── */}
            <section style={{ padding: '0 3rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                }}>
                    {PROJECTS.map((p, i) => (
                        <ProjectCard key={i} item={p} index={i} />
                    ))}
                </div>
            </section>

            {/* ─── MANIFESTO SECTION ─── */}
            <ManifestoSection />

            {/* ─── FOOTER ─── */}
            <footer style={{
                marginTop: '0',
                padding: '2.5rem 3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1rem',
            }}>
                <a href="#interactive" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textDecoration: 'none', transition: 'color 0.3s',
                }}>← BACK TO PORTFOLIO</a>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-muted)', letterSpacing: '0.12em',
                }}>© 2026 NOTOOW</span>
            </footer>
        </div>
    );
}
