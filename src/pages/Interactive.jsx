import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { CursorGlow, useTilt3D, SkillScene } from '../components/Scene3D';

/* ═══════════════════════════════════════════════════
   VIDEO DATA — 나중에 videoId만 교체하면 OK
   ═══════════════════════════════════════════════════ */

const SKILLS_DATA = [
    {
        id: 'film',
        title: '촬영',
        en: 'CINEMATOGRAPHY',
        num: '01',
        desc: '드론, 멀티캠, 현장 스케치 등 다양한 촬영 환경에서의 실전 경험. 의료, 커머스, 스포츠 등 다방면.',
        detail: '다방면 촬영 · 드론 운용',
        color: 'var(--tone-warm)',
        videoId: 'YN28Fyo0Q7Q',
        reelUrl: '#film',
    },
    {
        id: 'edit',
        title: '편집',
        en: 'POST-PRODUCTION',
        num: '02',
        desc: '인트로, 모션그래픽, 유튜브 디자인대판, 커러그레이딩. 유튜브 채널 다수 경험.',
        detail: '모션그래픽 · 커러그레이딩',
        color: 'var(--tone-cool)',
        videoId: 'OZU-Cxj-49w',
        reelUrl: '#edit',
    },
    {
        id: '3d',
        title: '3D',
        en: '3D VISUALIZATION',
        num: '03',
        desc: 'Cinema 4D, Blender 기반 제품 3D 렌더링, 홍보 애니메이션, 로고 제작.',
        detail: 'Cinema 4D · Blender',
        color: 'var(--tone-vivid)',
        videoId: '3sVkYrFfHjw',
        reelUrl: '#3d',
    },
    {
        id: 'dev',
        title: '개발',
        en: 'DEVELOPMENT',
        num: '04',
        desc: '웹앱, 자동화 도구, AI 통합 서비스를 직접 설계하고 구현. React, Python, FFmpeg 기반.',
        detail: 'React · TypeScript · Python',
        color: 'var(--tone-mint)',
        videoId: 'N-MJOCrLh0A',
        reelUrl: '#dev',
    },
];

const WORKS = [
    { title: '빈지노 24:26 3D 커버', type: '3D 뮤직비주얼', cat: '3D', videoId: 'OZU-Cxj-49w' },
    { title: 'Blender 3D Text Logo', type: '3D 타이포', cat: '3D', videoId: '3sVkYrFfHjw' },
    { title: 'Building 2D Animation', type: '2D 애니메이션', cat: '3D', videoId: 'Av2oG8Mp3ic' },
    { title: 'AstraZeneca 백신 3D', type: '3D 제품', cat: '3D', videoId: 'XDLWgUJ2eD4' },
    { title: 'Cactus Jack 3D Logo', type: '3D 로고', cat: '3D', videoId: 'f4j-vPBNb0k' },
    { title: '천사소녀 네티 OST', type: '음악 리메이크', cat: 'EDIT', videoId: 'mkA-BkpoX6E' },
    { title: 'HSBC 환경캠프', type: '다큐멘터리', cat: 'FILM', videoId: 'YN28Fyo0Q7Q' },
    { title: 'Unity Tutorials', type: '개발 튜토리얼', cat: 'DEV', videoId: 'N-MJOCrLh0A' },
    { title: '촬영 프로젝트 A', type: '촬영', cat: 'FILM', videoId: 'YN28Fyo0Q7Q' },
    { title: '편집 프로젝트 A', type: '편집', cat: 'EDIT', videoId: 'OZU-Cxj-49w' },
];

const DEV_PROJECTS = [
    {
        title: 'Paper Prism',
        desc: 'Premiere Pro .prproj에서 자막을 자동 추출. 그래픽 자막, 캡션, 중첩 시퀀스 파싱.',
        tech: ['React', 'TypeScript', 'Hugging Face'],
        status: 'Live', accent: 'var(--tone-mint)',
    },
    {
        title: 'Notoow Portfolio',
        desc: '지금 이 사이트. Vite + React, Three.js 3D 씬, Framer Motion 시네마틱 애니메이션.',
        tech: ['React', 'Three.js', 'Framer Motion'],
        status: 'Live', accent: 'var(--accent)',
    },
    {
        title: 'DRM Defense PoC',
        desc: 'Widevine L3 취약점 탐지 · 시각화. EME API 후킹, 키 추출 시뮬레이션.',
        tech: ['JavaScript', 'EME API', 'Extension'],
        status: 'Prototype', accent: 'var(--tone-vivid)',
    },
    {
        title: '업무 자동화',
        desc: '영상 파일 분류, 렌더 큐 관리, 클라이언트 전달 파이프라인 자동화.',
        tech: ['Python', 'FFmpeg', 'Automation'],
        status: 'Internal', accent: 'var(--tone-warm)',
    },
];

const TOOLS = [
    'Premiere Pro', 'After Effects', 'DaVinci Resolve',
    'Cinema 4D', 'Blender', 'Photoshop',
    'Figma', 'React', 'Python',
    'Three.js', 'FFmpeg', 'DJI Drone',
];

/* ─── YouTube helpers ─── */
const ytThumb = (id, q = 'maxresdefault') => `https://img.youtube.com/vi/${id}/${q}.jpg`;
const ytEmbed = (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&controls=1`;

/* ═══════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════ */
function VideoLightbox({ videoId, onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '90vw', maxWidth: '1100px', aspectRatio: '16/9',
                    borderRadius: '12px', overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                }}
            >
                <iframe
                    src={ytEmbed(videoId)} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </motion.div>
            <button onClick={onClose} style={{
                position: 'absolute', top: '2rem', right: '2rem',
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)',
            }}>✕</button>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════ */
export default function Interactive() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [lightboxVideo, setLightboxVideo] = useState(null);

    useEffect(() => {
        const handler = (e) => setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    const openVideo = useCallback((id) => setLightboxVideo(id), []);
    const closeVideo = useCallback(() => setLightboxVideo(null), []);

    return (
        <div style={{
            background: 'var(--bg-void)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-kr)', overflowX: 'hidden', cursor: 'none',
        }}>
            <CursorGlow />
            <FloatingNav />
            <CinemaHero mousePos={mousePos} />
            <MarqueeBar />
            <AboutSection />
            <FullscreenSkills onPlayVideo={openVideo} />
            <HorizontalGallery onPlayVideo={openVideo} />
            <DevShowcase />
            <ToolCloud />
            <FinalCTA mousePos={mousePos} />
            <Footer />

            <AnimatePresence>
                {lightboxVideo && <VideoLightbox videoId={lightboxVideo} onClose={closeVideo} />}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   FLOATING NAV
   ═══════════════════════════════════════════════════ */
function FloatingNav() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const fn = () => setVisible(window.scrollY > window.innerHeight * 0.5);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: visible ? 0 : -80 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0.8rem 3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(2,2,2,0.85)',
                backdropFilter: 'blur(24px) saturate(1.5)',
                borderBottom: '1px solid var(--border)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <a href="#home" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hero)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>← HOME</a>
                <span style={{ fontFamily: 'var(--font-en)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-hero)' }}>
                    notoow<span style={{ color: 'var(--accent)' }}>.</span>
                </span>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                {['About', 'Skills', 'Works', 'Dev', 'Contact'].map(l => (
                    <a key={l} href={`#${l.toLowerCase()}`}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', transition: 'color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hero)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{l}</a>
                ))}
            </div>
        </motion.nav>
    );
}

/* ═══════════════════════════════════════════════════
   CINEMA HERO
   ═══════════════════════════════════════════════════ */
function CinemaHero({ mousePos }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const yTitle = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const yNumbers = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section ref={ref} style={{
            height: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute',
                left: `${50 + mousePos.x * 12}%`, top: `${50 + mousePos.y * 8}%`,
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, var(--accent-glow), transparent 50%)',
                filter: 'blur(80px)', pointerEvents: 'none',
                transition: 'left 1s, top 1s',
            }} />

            <motion.div style={{ y: yNumbers, opacity }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-en)', fontSize: 'clamp(15rem, 30vw, 25rem)',
                    fontWeight: 900, color: 'var(--text-dim)', opacity: 0.3,
                    letterSpacing: '-0.05em', userSelect: 'none', pointerEvents: 'none',
                    transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
                    transition: 'transform 1.2s var(--ease-smooth)',
                }}>04</div>
            </motion.div>

            <motion.div style={{ y: yTitle, opacity, position: 'relative', zIndex: 5, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                    <div style={{ display: 'inline-flex', gap: '0.6rem', alignItems: 'center', marginBottom: '2rem' }}>
                        <span style={{ width: '30px', height: '1px', background: 'var(--accent)', display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.15em' }}>
                            4 DISCIPLINES — 1 PERSON
                        </span>
                        <span style={{ width: '30px', height: '1px', background: 'var(--accent)', display: 'inline-block' }} />
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-kr)',
                        fontSize: 'clamp(3rem, 7vw, 6rem)',
                        fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em',
                        marginBottom: '2rem',
                        transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 2}px)`,
                        transition: 'transform 0.8s var(--ease-smooth)',
                    }}>
                        촬영부터 개발까지,<br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--accent), #F2A97B)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>혼자 다 합니다.</span>
                    </h1>

                    <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
                        카메라를 들고, 편집실에 앉고, 3D를 렌더링하고, 코드를 씁니다.
                    </p>
                </motion.div>
            </motion.div>

            <div style={{
                position: 'absolute', bottom: '2.5rem', left: '50%',
                transform: 'translateX(-50%)', zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                <div style={{
                    width: '1px', height: '50px',
                    background: 'linear-gradient(to bottom, transparent, var(--text-muted))',
                    animation: 'bLine 2s ease-in-out infinite',
                }} />
            </div>
            <style>{`@keyframes bLine { 0%,100% { opacity:0.15 } 50% { opacity:0.6 } }`}</style>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════════════ */
function MarqueeBar() {
    const t = 'FILM · EDIT · 3D · DEV · DRONE · MOTION · YOUTUBE · WEBAPP · AUTOMATION · ';
    const d = t.repeat(5);
    return (
        <div style={{ overflow: 'hidden', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
                style={{ display: 'flex', whiteSpace: 'nowrap', fontFamily: 'var(--font-en)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--text-dim)' }}>
                <span>{d}</span><span>{d}</span>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ABOUT — 자기소개 + 이력
   ═══════════════════════════════════════════════════ */
function AboutSection() {
    const CAREER = [
        {
            period: '2024 — 현재',
            role: '기술이사 (CTO)',
            company: '한줄',
            desc: '영상제작팀 운영. 유튜브 편집, 3D, 모션그래픽, 팀 생산성 기여, 납기 관리, 디자인 대판 제작, 색보정, 검수.',
            current: true,
        },
        {
            period: '2019 — 현재',
            role: '프리랜서',
            company: '독립',
            desc: '촬영, 편집, 3D, 개발까지 1인 멀티 프로덕션. 의료, 커머스, 스포츠, 유튜브 등 다양한 업종 경험.',
            current: true,
        },
    ];

    return (
        <section id="about" style={{
            padding: '8rem 3rem', borderTop: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '10%', right: '15%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(224,90,58,0.04), transparent 60%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '1200px', margin: '0 auto',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem',
                position: 'relative',
            }}>
                {/* Left — Intro */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: 'var(--text-muted)', letterSpacing: '0.15em',
                            display: 'block', marginBottom: '2rem',
                        }}>ABOUT</span>

                        <h2 style={{
                            fontFamily: 'var(--font-kr)',
                            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                            fontWeight: 800, lineHeight: 1.25,
                            letterSpacing: '-0.02em', marginBottom: '2rem',
                        }}>
                            카메라를 잡고,<br />
                            편집하고, 렌더링하고,<br />
                            <span style={{
                                background: 'linear-gradient(135deg, var(--accent), #F2A97B)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>코드를 씁니다.</span>
                        </h2>

                        <div style={{
                            fontSize: '0.95rem', lineHeight: 1.85,
                            color: 'var(--text-secondary)',
                            display: 'flex', flexDirection: 'column', gap: '1rem',
                        }}>
                            <p>
                                2019년부터 프리랜서로 활동하며 촬영, 편집, 3D, 개발까지
                                혼자 해결하는 워크플로우를 만들어왔습니다.
                            </p>
                            <p>
                                현재는 <span style={{ color: 'var(--text-hero)', fontWeight: 600 }}>한줄</span>의
                                기술이사로서 영상제작팀을 이끌며,
                                유튜브 편집 · 3D · 모션그래픽 제작은 물론
                                팀의 생산성 향상, 납기 관리, 디자인 대판 제작,
                                색보정 및 최종 검수까지 담당하고 있습니다.
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                "하나의 프로젝트를 처음부터 끝까지 책임질 수 있는 사람"<br />
                                — 그것이 제가 추구하는 방향입니다.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right — Career Timeline */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: 'var(--text-muted)', letterSpacing: '0.15em',
                            display: 'block', marginBottom: '2rem',
                        }}>EXPERIENCE</span>

                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '2rem', borderLeft: '1px solid var(--border)' }}>
                            {CAREER.map((item, i) => (
                                <motion.div
                                    key={item.role}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        padding: '2rem 0',
                                        borderBottom: '1px solid var(--border)',
                                        position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', left: '-2.3rem', top: '2.4rem',
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: item.current ? 'var(--accent)' : 'var(--text-dim)',
                                        boxShadow: item.current ? '0 0 12px var(--accent)' : 'none',
                                        border: '2px solid var(--bg-void)',
                                    }} />

                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', marginBottom: '0.5rem',
                                    }}>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                                            color: item.current ? 'var(--accent)' : 'var(--text-muted)',
                                            letterSpacing: '0.1em',
                                        }}>{item.period}</span>
                                        {item.current && (
                                            <span style={{
                                                padding: '0.15rem 0.5rem', borderRadius: '100px',
                                                background: 'rgba(224,90,58,0.1)',
                                                border: '1px solid rgba(224,90,58,0.2)',
                                                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                                color: 'var(--accent)', letterSpacing: '0.08em',
                                            }}>CURRENT</span>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '0.6rem' }}>
                                        <h4 style={{
                                            fontSize: '1.15rem', fontWeight: 700,
                                            color: 'var(--text-hero)', marginBottom: '0.15rem',
                                        }}>{item.role}</h4>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                                            color: 'var(--text-secondary)', letterSpacing: '0.04em',
                                        }}>{item.company}</span>
                                    </div>

                                    <p style={{
                                        fontSize: '0.85rem', lineHeight: 1.65,
                                        color: 'var(--text-muted)',
                                    }}>{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem',
                            borderTop: '1px solid var(--border)',
                        }}>
                            {[
                                { label: '경력', value: `${new Date().getFullYear() - 2019}년+` },
                                { label: '현 직책', value: 'CTO' },
                                { label: '기반', value: '서울' },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                >
                                    <span style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                        color: 'var(--text-muted)', letterSpacing: '0.12em',
                                        display: 'block', marginBottom: '0.3rem',
                                    }}>{s.label}</span>
                                    <span style={{
                                        fontFamily: 'var(--font-en)', fontSize: '1.5rem',
                                        fontWeight: 700, color: 'var(--text-hero)',
                                    }}>{s.value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   FULLSCREEN SKILLS — with 3D object per slide
   ═══════════════════════════════════════════════════ */
function FullscreenSkills({ onPlayVideo }) {
    return (
        <section id="skills">
            {SKILLS_DATA.map((skill, i) => (
                <SkillSlide key={skill.id} skill={skill} index={i} onPlay={onPlayVideo} />
            ))}
        </section>
    );
}

function SkillSlide({ skill, index, onPlay }) {
    const ref = useRef(null);
    const isInView = useIsInView(ref, { margin: '-30%' });
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
    const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const textY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -40]);
    const [imgHov, setImgHov] = useState(false);
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} style={{
            minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
            position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border)',
        }}>
            {/* Image side with 3D object overlay */}
            <motion.div
                style={{ position: 'relative', overflow: 'hidden', order: isEven ? 1 : 2, background: 'var(--bg-deep)', cursor: 'pointer' }}
                onMouseEnter={() => setImgHov(true)}
                onMouseLeave={() => setImgHov(false)}
                onClick={() => onPlay(skill.videoId)}
            >
                <motion.img src={ytThumb(skill.videoId)} alt={skill.title} loading="lazy"
                    onError={(e) => { e.target.src = ytThumb(skill.videoId, 'hqdefault'); }}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: imgHov ? 'brightness(0.55) saturate(1)' : 'brightness(0.35) saturate(0.7)',
                        scale: imgScale, y: imgY, transition: 'filter 0.5s',
                    }}
                />

                {/* 3D object floating over the image */}
                <SkillScene skillId={skill.id} isActive={isInView} />

                {/* Play button */}
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: imgHov ? 1 : 0.3, transition: 'opacity 0.4s', zIndex: 2,
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: imgHov ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.4s var(--ease-expo)',
                        transform: imgHov ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: imgHov ? '0 12px 40px rgba(224,90,58,0.3)' : 'none',
                    }}>
                        <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                            <path d="M2 1.5L20.5 13L2 24.5V1.5Z" fill={imgHov ? '#fff' : 'rgba(255,255,255,0.8)'} />
                        </svg>
                    </div>
                </div>

                <div style={{
                    position: 'absolute', bottom: '2rem', left: '2rem',
                    fontFamily: 'var(--font-en)', fontSize: '8rem',
                    fontWeight: 900, color: 'rgba(255,255,255,0.03)',
                    lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                }}>{skill.num}</div>

                <span style={{
                    position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 3,
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
                    opacity: imgHov ? 1 : 0, transition: 'opacity 0.3s',
                }}>▶ PLAY VIDEO</span>
            </motion.div>

            {/* Text side */}
            <div style={{
                display: 'flex', alignItems: 'center', padding: '4rem 5rem',
                order: isEven ? 2 : 1, position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', [isEven ? 'left' : 'right']: 0,
                    top: '30%', height: '40%', width: '3px',
                    background: isInView ? `linear-gradient(to bottom, transparent, ${skill.color}, transparent)` : 'transparent',
                    transition: 'background 0.8s',
                }} />

                <motion.div style={{ y: textY }}>
                    <motion.div
                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: skill.color, letterSpacing: '0.2em', display: 'block', marginBottom: '1.5rem' }}>
                            {skill.num} — {skill.en}
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-kr)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                            {skill.title}
                        </h2>
                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
                            {skill.desc}
                        </p>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{
                                display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '100px',
                                border: `1px solid ${skill.color}40`, background: `${skill.color}08`,
                                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: skill.color, letterSpacing: '0.06em',
                            }}>{skill.detail}</span>

                            <a href={skill.reelUrl} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1.2rem', borderRadius: '100px',
                                    background: skill.color, color: 'var(--bg-void)',
                                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                                    fontWeight: 700, letterSpacing: '0.06em',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 8px 25px ${skill.color}40`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                전체 포트폴리오 →
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   HORIZONTAL GALLERY — 3D tilt on cards
   ═══════════════════════════════════════════════════ */
function HorizontalGallery({ onPlayVideo }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const x = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);

    return (
        <section id="works" ref={containerRef} style={{
            height: `${WORKS.length * 40}vh`, position: 'relative',
            borderTop: '1px solid var(--border)',
        }}>
            <div style={{
                position: 'sticky', top: 0, height: '100vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
                <div style={{
                    padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid var(--border)', flexShrink: 0,
                }}>
                    <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.3rem' }}>
                            SELECTED WORKS
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-kr)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                            실제 <span style={{ color: 'var(--accent)' }}>프로젝트</span>
                        </h2>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                        {WORKS.length} PROJECTS · CLICK TO PLAY
                    </span>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 3rem' }}>
                    <motion.div style={{ display: 'flex', gap: '1.5rem', x, padding: '2rem 0' }}>
                        {WORKS.map((w, i) => (
                            <GalleryCard key={`${w.title}-${i}`} work={w} index={i} onPlay={onPlayVideo} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function GalleryCard({ work, index, onPlay }) {
    const [hov, setHov] = useState(false);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(800px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg)`;
    };

    const handleMouseLeave = () => {
        setHov(false);
        if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setHov(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onPlay(work.videoId)}
            style={{
                flexShrink: 0, width: '380px', cursor: 'pointer',
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
            }}
        >
            <div style={{
                position: 'relative', overflow: 'hidden', borderRadius: '8px',
                height: '50vh', minHeight: '300px', background: 'var(--bg-deep)',
            }}>
                <img src={ytThumb(work.videoId)} alt={work.title} loading="lazy"
                    onError={(e) => { e.target.src = ytThumb(work.videoId, 'hqdefault'); }}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.7s var(--ease-expo), filter 0.7s',
                        transform: hov ? 'scale(1.06)' : 'scale(1)',
                        filter: hov ? 'brightness(0.9)' : 'brightness(0.5)',
                    }}
                />
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: hov ? 1 : 0, transition: 'opacity 0.4s',
                }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 30px rgba(224,90,58,0.35)',
                        transform: hov ? 'scale(1)' : 'scale(0.8)', transition: 'transform 0.4s var(--ease-expo)',
                    }}>
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M2 1L16 10L2 19V1Z" fill="#fff" /></svg>
                    </div>
                </div>
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>
                        {work.cat} — {work.type}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{work.title}</h3>
                </div>
                <span style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    fontFamily: 'var(--font-en)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.12)',
                }}>{String(index + 1).padStart(2, '0')}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DEV SHOWCASE — 3D tilt cards
   ═══════════════════════════════════════════════════ */
function DevShowcase() {
    return (
        <section id="dev" style={{ padding: '8rem 3rem', borderTop: '1px solid var(--border)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20%', left: '60%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(93,184,168,0.04), transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'block', marginBottom: '1rem' }}>DEVELOPMENT</span>
                    <h2 style={{ fontFamily: 'var(--font-kr)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        영상만 만드는 사람이<br /><span style={{ color: 'var(--tone-mint)' }}>아닙니다.</span>
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '500px', marginTop: '1rem' }}>
                        반복되는 비효율을 코드로 해결합니다.
                        자막 추출 자동화, 렌더 파이프라인, 웹 애플리케이션 — 직접 설계하고 직접 구현합니다.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {DEV_PROJECTS.map((p, i) => (
                        <DevCard key={p.title} project={p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function DevCard({ project: p, index: i }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(600px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg) translateY(-6px)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) cardRef.current.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                padding: '2rem', borderRadius: '12px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                position: 'relative', overflow: 'hidden',
                marginTop: i % 2 === 1 ? '3rem' : 0,
                transition: 'transform 0.15s ease-out, border-color 0.3s',
                transformStyle: 'preserve-3d',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave2={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `radial-gradient(circle, ${p.accent}10, transparent 65%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', position: 'relative' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.title}</h4>
                <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                    background: p.status === 'Live' ? 'rgba(93,184,168,0.1)' : 'var(--glass)',
                    color: p.status === 'Live' ? 'var(--tone-mint)' : 'var(--text-muted)',
                    border: `1px solid ${p.status === 'Live' ? 'rgba(93,184,168,0.2)' : 'var(--border)'}`,
                }}>{p.status}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem', position: 'relative' }}>{p.desc}</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', position: 'relative' }}>
                {p.tech.map(t => (
                    <span key={t} style={{
                        padding: '0.2rem 0.5rem', borderRadius: '4px',
                        background: 'var(--glass)', border: '1px solid var(--border)',
                        fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                    }}>{t}</span>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   TOOL CLOUD
   ═══════════════════════════════════════════════════ */
function ToolCloud() {
    return (
        <section style={{ padding: '4rem 3rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'block', marginBottom: '2rem' }}>TOOLKIT</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {TOOLS.map((tool, i) => (
                        <motion.span key={tool}
                            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.03 }}
                            whileHover={{ scale: 1.08, y: -3, transition: { duration: 0.2 } }}
                            style={{
                                padding: '0.7rem 1.3rem', borderRadius: '100px',
                                border: '1px solid var(--border)', background: 'var(--glass)',
                                fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)',
                                cursor: 'default', transition: 'border-color 0.3s, color 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-hero)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >{tool}</motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════ */
function FinalCTA({ mousePos }) {
    return (
        <section id="contact" style={{
            height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border)',
        }}>
            <div style={{
                position: 'absolute',
                left: `${50 + mousePos.x * 10}%`, top: `${50 + mousePos.y * 8}%`,
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, var(--accent-glow), transparent 50%)',
                filter: 'blur(80px)', pointerEvents: 'none', transition: 'left 1.2s, top 1.2s',
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', display: 'block', marginBottom: '1.5rem' }}>NEXT PROJECT</span>
                    <h2 style={{ fontFamily: 'var(--font-kr)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                        다음 프로젝트,<br />
                        <span style={{ background: 'linear-gradient(135deg, var(--accent), #F2A97B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>함께 만들어볼까요?</span>
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>촬영 · 편집 · 3D · 개발 — 어떤 조합이든.</p>
                    <a href="mailto:hello@notoow.com" style={{
                        display: 'inline-block', padding: '1rem 3rem', borderRadius: '100px',
                        background: 'var(--text-hero)', color: 'var(--bg-void)',
                        fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em',
                        transition: 'all 0.4s var(--ease-expo)',
                    }}
                        onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 12px 40px rgba(224,90,58,0.3)'; }}
                        onMouseLeave={e => { e.target.style.background = 'var(--text-hero)'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}>
                        프로젝트 문의하기
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
    return (
        <footer style={{
            padding: '2.5rem 3rem', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>© 2026 NOTOOW</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['YouTube', 'Instagram'].map(p => (
                    <a key={p} href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', transition: 'color 0.3s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--text-hero)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{p}</a>
                ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>SEOUL, KR</span>
        </footer>
    );
}

/* ═══════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════ */
function useIsInView(ref, options = {}) {
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin: options.margin || '0px' });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, options.margin]);
    return isInView;
}
