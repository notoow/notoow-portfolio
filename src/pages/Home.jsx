import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroScene, CursorGlow } from '../components/Scene3D';

/* ═══════════════════════════════════════════
   HOME — Cinematic 3D Landing
   ═══════════════════════════════════════════ */

export default function Home() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handler = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            });
        };
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    return (
        <div style={{
            background: 'var(--bg-void)', color: 'var(--text-hero)',
            minHeight: '100vh', overflow: 'hidden', cursor: 'none',
        }}>
            <CursorGlow />
            <CinematicHero mousePos={mousePos} />
            <RollingStrip />
            <BentoPreview />
            <MinimalFooter />
        </div>
    );
}

/* ─── CINEMATIC 3D HERO ─── */
function CinematicHero({ mousePos }) {
    const [time, setTime] = useState('');
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    useEffect(() => {
        const update = () => {
            const d = new Date();
            setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }));
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <section ref={containerRef} style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', position: 'relative', overflow: 'hidden',
        }}>
            {/* 3D Scene (behind everything) */}
            <HeroScene mousePos={mousePos} />

            {/* Noise grain */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 2, opacity: 0.03, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px',
            }} />

            {/* Top bar */}
            <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    padding: '2rem 3rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    zIndex: 10,
                }}>
                    <span style={{
                        fontFamily: 'var(--font-en)', fontSize: '1.5rem',
                        fontWeight: 700, letterSpacing: '-0.02em',
                    }}>
                        notoow<span style={{ color: 'var(--accent)' }}>.</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            color: 'var(--text-muted)', letterSpacing: '0.1em',
                        }}>
                            SEOUL {time}
                        </span>
                        <a href="#interactive" style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            color: 'var(--bg-void)', background: 'var(--text-hero)',
                            padding: '0.5rem 1.2rem', borderRadius: '100px',
                            fontWeight: 600, letterSpacing: '0.06em',
                            transition: 'all 0.3s var(--ease-expo)',
                            cursor: 'none',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--accent)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'var(--text-hero)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}>
                            PORTFOLIO →
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Central hero text — on top of 3D */}
            <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
                <div style={{
                    position: 'relative', zIndex: 5,
                    padding: '0 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%',
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 style={{
                            fontFamily: 'var(--font-kr)',
                            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                            fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em',
                            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 3}px)`,
                            transition: 'transform 0.6s var(--ease-smooth)',
                        }}>
                            <span style={{ display: 'block', color: 'var(--text-hero)' }}>촬영부터</span>
                            <span style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, var(--accent), #F5A87A)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                개발까지.
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        style={{
                            position: 'absolute', right: '3rem', bottom: '-6rem',
                            textAlign: 'right', maxWidth: '380px',
                        }}
                    >
                        <p style={{
                            fontSize: '1rem', lineHeight: 1.7,
                            color: 'var(--text-secondary)', fontWeight: 400,
                        }}>
                            팀이 아닙니다.<br />
                            카메라, 편집실, 3D 렌더링, 코드 —<br />
                            <span style={{ color: 'var(--text-hero)', fontWeight: 600 }}>한 사람</span>이 전부 합니다.
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom */}
            <div style={{
                position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                zIndex: 10,
            }}>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    {['FILM', 'EDIT', '3D', 'DEV'].map((w, i) => (
                        <motion.span
                            key={w}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                            style={{
                                fontFamily: 'var(--font-en)', fontSize: '0.7rem',
                                fontWeight: 600, letterSpacing: '0.2em',
                                color: 'var(--text-muted)',
                                borderTop: '1px solid var(--text-dim)',
                                paddingTop: '0.5rem', minWidth: '60px',
                            }}
                        >
                            {w}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
                >
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                        letterSpacing: '0.2em', color: 'var(--text-muted)',
                        writingMode: 'vertical-rl',
                    }}>SCROLL</span>
                    <div style={{
                        width: '1px', height: '40px',
                        background: 'linear-gradient(to bottom, var(--text-muted), transparent)',
                        animation: 'breathe 2.5s ease-in-out infinite',
                    }} />
                </motion.div>
            </div>
            <style>{`@keyframes breathe { 0%,100% { opacity:0.2;height:30px } 50% { opacity:0.8;height:50px } }`}</style>
        </section>
    );
}

/* ─── ROLLING TEXT STRIP ─── */
function RollingStrip() {
    const items = '촬영 · 편집 · 3D · 개발 · 드론 · 모션그래픽 · 유튜브 · 웹앱 · 자동화 · ';
    const repeated = items.repeat(4);

    return (
        <div style={{
            overflow: 'hidden', borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)', padding: '1.2rem 0',
            background: 'var(--bg-deep)',
        }}>
            <motion.div
                animate={{ x: [0, -50 + '%'] }}
                transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                style={{
                    display: 'flex', whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-en)', fontSize: '0.8rem',
                    fontWeight: 500, letterSpacing: '0.15em',
                    color: 'var(--text-muted)',
                }}
            >
                <span>{repeated}</span>
                <span>{repeated}</span>
            </motion.div>
        </div>
    );
}

/* ─── BENTO PREVIEW GRID — 카테고리별 포트폴리오 링크 ─── */
function BentoPreview() {
    // reelUrl: 나중에 유튜브 포트폴리오 링크로 교체
    const items = [
        { title: '촬영', en: 'CINEMATOGRAPHY', desc: '드론 · 멀티캠 · 현장 스케치', span: 'span 1', h: '280px', accent: 'var(--tone-warm)', reelUrl: '#film' },
        { title: '편집', en: 'POST-PRODUCTION', desc: '모션그래픽 · 컬러그레이딩 · 유튜브', span: 'span 1', h: '280px', accent: 'var(--tone-cool)', reelUrl: '#edit' },
        { title: '3D', en: '3D VISUALIZATION', desc: '제품 렌더링 · 애니메이션 · 로고', span: 'span 1', h: '280px', accent: 'var(--tone-vivid)', reelUrl: '#3d' },
        { title: '개발', en: 'DEVELOPMENT', desc: 'React · Python · 자동화 도구', span: 'span 2', h: '200px', accent: 'var(--tone-mint)', reelUrl: '#dev' },
        { title: '전체 보기', en: 'FULL PORTFOLIO', desc: '모든 작업물 한눈에', span: 'span 1', h: '200px', accent: 'var(--accent)', reelUrl: '#interactive' },
    ];

    return (
        <section style={{ padding: '5rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.8rem',
            }}>
                {items.map((item, i) => (
                    <TiltCard key={item.en} item={item} index={i} />
                ))}
            </div>
        </section>
    );
}

function TiltCard({ item, index }) {
    const cardRef = useRef(null);
    const [hov, setHov] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        setHov(false);
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    };

    return (
        <motion.a
            ref={cardRef}
            href={item.reelUrl}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                gridColumn: item.span,
                height: item.h,
                padding: '2rem', borderRadius: '12px',
                background: 'var(--bg-card)',
                border: `1px solid ${hov ? 'var(--border-hover)' : 'var(--border)'}`,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.15s ease-out',
                cursor: 'none',
                transformStyle: 'preserve-3d',
                boxShadow: hov ? `0 20px 60px ${item.accent}10` : 'none',
            }}
        >
            <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: '160px', height: '160px',
                background: `radial-gradient(circle, ${item.accent}12, transparent 65%)`,
                filter: 'blur(30px)', pointerEvents: 'none',
            }} />

            {/* Top: category label */}
            <div style={{ position: 'relative' }}>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                    color: item.accent, letterSpacing: '0.15em', opacity: 0.8,
                    display: 'block', marginBottom: '0.3rem',
                }}>{item.en}</span>
                <h3 style={{
                    fontFamily: 'var(--font-kr)', fontSize: '1.6rem',
                    fontWeight: 800, lineHeight: 1.2,
                }}>{item.title}</h3>
            </div>

            {/* Bottom: desc + reel link */}
            <div style={{ position: 'relative' }}>
                <p style={{
                    fontSize: '0.82rem', color: 'var(--text-secondary)',
                    marginBottom: '0.8rem', lineHeight: 1.5,
                }}>{item.desc}</p>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: hov ? item.accent : 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    transition: 'color 0.3s, transform 0.3s',
                    transform: hov ? 'translateX(4px)' : 'translateX(0)',
                }}>
                    REEL 보기 →
                </span>
            </div>
        </motion.a>
    );
}

/* ─── MINIMAL FOOTER ─── */
function MinimalFooter() {
    return (
        <footer style={{
            padding: '3rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            cursor: 'none',
        }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                © 2026 NOTOOW
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                SEOUL, KR
            </span>
        </footer>
    );
}
