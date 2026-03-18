import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

const BASE_URL = import.meta.env.BASE_URL;
const CLAUDE_CODE_VIDEO_ID = 'ggYmI9DIgJs';
const CLAUDE_CODE_SLIDES_VIEW_URL = 'https://docs.google.com/presentation/d/1O4yzG5smFp_4LtlkihSf3dFOp1o3C7ufR4A58YpQLeg/edit?slide=id.g3ab9e0cd2cf_0_1#slide=id.g3ab9e0cd2cf_0_1';
const WOOJU_DAESTAR_VIDEO_ID = 'yi1iuJM1Vww';
const WOOJU_DAESTAR_THUMBNAIL = `https://i.ytimg.com/vi/${WOOJU_DAESTAR_VIDEO_ID}/hqdefault.jpg`;
const CLAUDE_CODE_SLIDES = Array.from({ length: 22 }, (_, index) => ({
    id: index + 1,
    src: `${BASE_URL}case-studies/claude-code/slide-${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `클로드코드 발표자료 슬라이드 ${index + 1}`,
}));
const CLAUDE_CODE_CASE_STUDY_POINTS = [
    '영상 제작 파이프라인 자동화',
    '비개발자 관점의 Claude Code 실전 도입',
    '웹앱 구축부터 반복 업무 제거까지 연결',
];

const ytEmbed = (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&controls=1`;

const CATEGORY = {
    id: 'dev',
    title: '개발',
    en: 'DEVELOPMENT',
    desc: '웹 애플리케이션, 자동화 도구, AI 통합 서비스. 아이디어를 실제 프로덕트로 구현합니다.',
    color: '#5DB8A8', // mint tone
};

const PROJECTS = [
    {
        title: '클로드코드로 생산성 10배 올리기',
        type: 'YouTube / Dev Workflow',
        desc: 'Claude Code를 활용해 영상 제작과 개발 워크플로우를 자동화하고, 실제 작업 생산성을 끌어올린 과정을 정리한 영상.',
        media: `https://i.ytimg.com/vi/${CLAUDE_CODE_VIDEO_ID}/hqdefault.jpg`,
        popupType: 'case-study',
        videoId: CLAUDE_CODE_VIDEO_ID,
        slides: CLAUDE_CODE_SLIDES,
        slidesViewUrl: CLAUDE_CODE_SLIDES_VIEW_URL,
        color: 'linear-gradient(135deg, #162a2d 0%, #2f766b 100%)',
        textColor: '#f6fffd'
    },
    {
        title: '우주 대스타 (Cosmic Superstar)',
        type: 'Unity / Kinect v2',
        desc: '고양 스타필드 매직플로우 체험존. Kinect v2의 깊이와 가속도 데이터를 정밀 제어하여 사용자를 실시간 미러링하는 인터랙티브 XR 서비스.',
        media: WOOJU_DAESTAR_THUMBNAIL,
        popupType: 'video',
        videoId: WOOJU_DAESTAR_VIDEO_ID,
        color: 'linear-gradient(135deg, #1d2438 0%, #2f3a5d 100%)',
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

function CaseStudyModal({ item, isMobile, onClose, activeSlide, onSelectSlide }) {
    const slides = item.slides || [];
    const currentSlide = slides[activeSlide];
    const progress = slides.length ? ((activeSlide + 1) / slides.length) * 100 : 0;
    const goPrev = () => onSelectSlide(Math.max(activeSlide - 1, 0));
    const goNext = () => onSelectSlide(Math.min(activeSlide + 1, slides.length - 1));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.86)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '0.75rem' : '1.5rem',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                style={{
                    width: 'min(100%, 1320px)',
                    height: isMobile ? 'min(100%, 94vh)' : 'min(92vh, 920px)',
                    borderRadius: isMobile ? '20px' : '26px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-hover)',
                    background: 'rgba(10,10,10,0.98)',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr',
                }}
            >
                <div style={{
                    padding: isMobile ? '0.9rem 1rem' : '1rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '1rem',
                    flexDirection: isMobile ? 'column' : 'row',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                }}>
                    <div>
                        <span style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: 'var(--tone-mint)',
                            letterSpacing: '0.14em',
                            marginBottom: '0.35rem',
                        }}>
                            CASE STUDY / SLIDE DECK
                        </span>
                        <strong style={{
                            display: 'block',
                            fontSize: isMobile ? '1rem' : '1.08rem',
                            fontWeight: 700,
                            color: 'var(--text-hero)',
                        }}>
                            {item.title}
                        </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                        {item.slidesViewUrl && (
                            <a
                                href={item.slidesViewUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(93,184,168,0.25)',
                                    background: 'rgba(93,184,168,0.08)',
                                    color: 'var(--tone-mint)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.68rem',
                                    letterSpacing: '0.08em',
                                    textDecoration: 'none',
                                }}
                            >
                                GOOGLE SLIDES
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '999px',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                            }}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>

                <div style={{
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '360px minmax(0, 1fr)',
                    gap: 0,
                }}>
                    <aside style={{
                        minHeight: 0,
                        overflow: 'auto',
                        borderRight: isMobile ? 'none' : '1px solid var(--border)',
                        borderBottom: isMobile ? '1px solid var(--border)' : 'none',
                        padding: isMobile ? '1rem' : '1.15rem',
                        display: 'grid',
                        alignContent: 'start',
                        gap: '1rem',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))',
                    }}>
                        <div style={{
                            borderRadius: '18px',
                            overflow: 'hidden',
                            border: '1px solid var(--border)',
                            background: '#050505',
                            aspectRatio: '16 / 9',
                        }}>
                            <iframe
                                src={ytEmbed(item.videoId)}
                                title={item.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                            />
                        </div>

                        <div style={{
                            padding: isMobile ? '1rem' : '1.1rem',
                            borderRadius: '18px',
                            border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.02)',
                            display: 'grid',
                            gap: '0.9rem',
                        }}>
                            <div>
                                <span style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.62rem',
                                    color: 'var(--text-muted)',
                                    letterSpacing: '0.12em',
                                    marginBottom: '0.55rem',
                                }}>
                                    OVERVIEW
                                </span>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.75,
                                    fontSize: '0.95rem',
                                }}>
                                    {item.desc}
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                gap: '0.7rem',
                            }}>
                                <div style={{
                                    padding: '0.8rem',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.015)',
                                }}>
                                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                                        FORMAT
                                    </span>
                                    <strong style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-hero)', fontSize: '0.92rem' }}>
                                        Video + Deck
                                    </strong>
                                </div>
                                <div style={{
                                    padding: '0.8rem',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.015)',
                                }}>
                                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                                        SLIDES
                                    </span>
                                    <strong style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-hero)', fontSize: '0.92rem' }}>
                                        {slides.length} pages
                                    </strong>
                                </div>
                                <div style={{
                                    padding: '0.8rem',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.015)',
                                }}>
                                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                                        MODE
                                    </span>
                                    <strong style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-hero)', fontSize: '0.92rem' }}>
                                        Step by step
                                    </strong>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '0.55rem' }}>
                                {CLAUDE_CODE_CASE_STUDY_POINTS.map((point) => (
                                    <div
                                        key={point}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.7rem',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '999px',
                                            background: 'var(--tone-mint)',
                                            boxShadow: '0 0 0 6px rgba(93,184,168,0.1)',
                                            flexShrink: 0,
                                        }} />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section style={{
                        minHeight: 0,
                        overflow: 'auto',
                        padding: isMobile ? '1rem' : '1.25rem',
                        display: 'grid',
                        gap: '1rem',
                        alignContent: 'start',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            gap: '1rem',
                            flexDirection: isMobile ? 'column' : 'row',
                        }}>
                            <div style={{ minWidth: 0 }}>
                                <span style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.62rem',
                                    color: 'var(--text-muted)',
                                    letterSpacing: '0.12em',
                                    marginBottom: '0.4rem',
                                }}>
                                    DECK NAVIGATION
                                </span>
                                <strong style={{ color: 'var(--text-hero)', fontSize: '1rem' }}>
                                    Slide {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                </strong>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: isMobile ? '100%' : 'auto',
                            }}>
                                <div style={{
                                    width: isMobile ? '100%' : '180px',
                                    height: '6px',
                                    borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.08)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #5DB8A8, #9fe6da)',
                                    }} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        disabled={activeSlide === 0}
                                        style={{
                                            padding: '0.7rem 0.95rem',
                                            borderRadius: '999px',
                                            border: '1px solid var(--border)',
                                            background: activeSlide === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                                            color: activeSlide === 0 ? 'var(--text-muted)' : 'var(--text-hero)',
                                            cursor: activeSlide === 0 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        disabled={activeSlide === slides.length - 1}
                                        style={{
                                            padding: '0.7rem 0.95rem',
                                            borderRadius: '999px',
                                            border: '1px solid rgba(93,184,168,0.25)',
                                            background: activeSlide === slides.length - 1 ? 'rgba(93,184,168,0.05)' : 'rgba(93,184,168,0.12)',
                                            color: activeSlide === slides.length - 1 ? 'var(--text-muted)' : 'var(--tone-mint)',
                                            cursor: activeSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                        {currentSlide && (
                            <div style={{
                                borderRadius: isMobile ? '18px' : '22px',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                background: '#070707',
                                boxShadow: '0 24px 70px rgba(0,0,0,0.26)',
                            }}>
                                <img
                                    src={currentSlide.src}
                                    alt={currentSlide.alt}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        background: '#070707',
                                    }}
                                />
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gap: '0.7rem',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.62rem',
                                color: 'var(--text-muted)',
                                letterSpacing: '0.12em',
                            }}>
                                THUMBNAILS
                            </span>

                            <div style={{
                                display: 'grid',
                                gridAutoFlow: 'column',
                                gridAutoColumns: isMobile ? '112px' : '140px',
                                gap: '0.75rem',
                                overflowX: 'auto',
                                paddingBottom: '0.25rem',
                            }}>
                                {slides.map((slide, index) => {
                                    const active = index === activeSlide;
                                    return (
                                        <button
                                            key={slide.id}
                                            type="button"
                                            onClick={() => onSelectSlide(index)}
                                            style={{
                                                display: 'grid',
                                                gap: '0.45rem',
                                                padding: '0.45rem',
                                                borderRadius: '16px',
                                                border: active ? '1px solid rgba(93,184,168,0.7)' : '1px solid var(--border)',
                                                background: active ? 'rgba(93,184,168,0.08)' : 'rgba(255,255,255,0.02)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <div style={{
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                aspectRatio: '16 / 9',
                                                background: '#050505',
                                            }}>
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.62rem',
                                                color: active ? 'var(--tone-mint)' : 'var(--text-secondary)',
                                                letterSpacing: '0.08em',
                                            }}>
                                                SLIDE {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
            </motion.div>
        </motion.div>
    );
}

function MediaLightbox({ item, onClose }) {
    const { isMobile } = useResponsive();
    const isImage = item.popupType === 'image';
    const isVideo = item.popupType === 'video';
    const isCaseStudy = item.popupType === 'case-study';
    const slides = item.slides || [];
    const [activeSlide, setActiveSlide] = useState(0);

    React.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();

            if (isCaseStudy && slides.length > 0) {
                if (event.key === 'ArrowRight') {
                    setActiveSlide((prev) => Math.min(prev + 1, slides.length - 1));
                }

                if (event.key === 'ArrowLeft') {
                    setActiveSlide((prev) => Math.max(prev - 1, 0));
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isCaseStudy, onClose, slides.length]);

    React.useEffect(() => {
        setActiveSlide(0);
    }, [item]);

    if (isCaseStudy) {
        return (
            <CaseStudyModal
                item={item}
                isMobile={isMobile}
                onClose={onClose}
                activeSlide={activeSlide}
                onSelectSlide={setActiveSlide}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.84)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '1rem' : '2rem',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                style={{
                    width: 'min(100%, 1100px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-hover)',
                    background: 'rgba(12,12,12,0.96)',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
                }}
            >
                {isImage && (
                    <img
                        src={item.popupMedia}
                        alt={item.title}
                        style={{
                            display: 'block',
                            width: '100%',
                            maxHeight: '78vh',
                            objectFit: 'contain',
                            background: '#050505',
                        }}
                    />
                )}

                {(isVideo || isCaseStudy) && item.videoId && (
                    <div style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        background: '#050505',
                    }}>
                        <iframe
                            src={ytEmbed(item.videoId)}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        />
                    </div>
                )}

                <div style={{
                    padding: isMobile ? '1rem' : '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '1rem',
                }}>
                    <div>
                        <span style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: 'var(--tone-mint)',
                            letterSpacing: '0.1em',
                            marginBottom: '0.35rem',
                        }}>{item.type}</span>
                        <strong style={{
                            display: 'block',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: 'var(--text-hero)',
                        }}>{item.title}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {isCaseStudy && item.slidesViewUrl && (
                            <a
                                href={item.slidesViewUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(93,184,168,0.25)',
                                    background: 'rgba(93,184,168,0.08)',
                                    color: 'var(--tone-mint)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.68rem',
                                    letterSpacing: '0.08em',
                                    textDecoration: 'none',
                                }}
                            >
                                OPEN SLIDES
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '999px',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                            }}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ProjectCard({ item, index }) {
    const { isMobile } = useResponsive();
    const [hover, setHover] = useState(false);

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={item.onClick}
            style={{
                display: 'block',
                textDecoration: 'none',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                width: '100%',
                aspectRatio: '16/10',
                background: item.color || '#222',
                boxShadow: hover ? '0 20px 50px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                transform: hover ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                textAlign: 'left',
            }}
        >
            {item.media && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${item.media})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: hover ? 'brightness(0.85)' : 'brightness(0.7)',
                    transform: hover ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s',
                }} />
            )}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: item.media ? 'linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.24))' : 'transparent',
            }} />
            <div style={{
                padding: isMobile ? '1.25rem' : '2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: item.textColor || '#fff',
                position: 'relative',
                zIndex: 2,
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
                    <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.8,
                        maxWidth: isMobile ? 'calc(100% - 54px)' : '80%',
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
        </motion.button>
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
    const { isMobile } = useResponsive();
    const [lightboxItem, setLightboxItem] = useState(null);
    const projects = PROJECTS.map((item) => ({
        ...item,
        onClick: item.popupType
            ? () => setLightboxItem(item)
            : () => {
                if (item.url) {
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                }
            },
    }));

    return (
        <div style={{
            background: 'var(--bg-void)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-kr)', minHeight: '100vh',
            paddingBottom: '5rem',
        }}>
            {/* ─── TOP NAV ─── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: isMobile ? '0.8rem 1rem' : '0.8rem 3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(2,2,2,0.85)',
                backdropFilter: 'blur(24px) saturate(1.5)',
                borderBottom: '1px solid var(--border)',
            }}>
                <a href="#portfolio-overview" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textDecoration: 'none', transition: 'color 0.3s',
                }}>← BACK</a>
                <a href="#home" style={{ fontFamily: 'var(--font-en)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-hero)', textDecoration: 'none' }}>
                    notoow<span style={{ color: 'var(--accent)' }}>.</span>
                </a>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: CATEGORY.color, letterSpacing: '0.15em',
                    display: isMobile ? 'none' : 'inline',
                }}>{CATEGORY.en}</span>
            </nav>

            {/* ─── HERO ─── */}
            <section style={{
                height: isMobile ? 'auto' : '45vh', minHeight: isMobile ? '280px' : '350px',
                display: 'flex', alignItems: 'flex-end',
                padding: isMobile ? '6rem 1rem 2.5rem' : '0 3rem 4rem', position: 'relative', overflow: 'hidden',
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
            <section style={{ padding: isMobile ? '0 1rem' : '0 3rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                }}>
                    {projects.map((p, i) => (
                        <ProjectCard key={i} item={p} index={i} />
                    ))}
                </div>
            </section>

            {/* ─── MANIFESTO SECTION ─── */}
            <ManifestoSection />

            {/* ─── FOOTER ─── */}
            <footer style={{
                marginTop: '0',
                padding: isMobile ? '1.5rem 1rem 2.5rem' : '2.5rem 3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
                flexWrap: 'wrap', gap: '1rem',
            }}>
                <a href="#portfolio-overview" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textDecoration: 'none', transition: 'color 0.3s',
                }}>← BACK TO PORTFOLIO</a>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-muted)', letterSpacing: '0.12em',
                }}>© 2026 NOTOOW</span>
            </footer>

            <AnimatePresence>
                {lightboxItem && (
                    <MediaLightbox
                        item={lightboxItem}
                        onClose={() => setLightboxItem(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
