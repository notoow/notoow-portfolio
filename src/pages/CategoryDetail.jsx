import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── YouTube helpers ─── */
const ytThumb = (id, q = 'maxresdefault') => `https://img.youtube.com/vi/${id}/${q}.jpg`;
const ytEmbed = (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&controls=1`;

/* ═══════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════ */
function VideoLightbox({ videoId, title, onClose }) {
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
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', cursor: 'pointer',
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
                    src={ytEmbed(videoId)} title={title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </motion.div>
            {title && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'var(--font-kr)', textAlign: 'center',
                    }}
                >{title}</motion.p>
            )}
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
   VIDEO CARD
   ═══════════════════════════════════════════════════ */
function VideoCard({ item, index, onPlay }) {
    const [hov, setHov] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Staggered heights for masonry feel
    const heights = ['340px', '280px', '360px', '300px', '320px', '290px'];
    const h = heights[index % heights.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (index % 3) * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={() => onPlay(item.videoId, item.title)}
            style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: '10px', cursor: 'pointer',
                height: h, background: 'var(--bg-card)',
                border: `1px solid ${hov ? 'var(--border-hover)' : 'var(--border)'}`,
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxShadow: hov ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
            }}
        >
            {/* Thumbnail */}
            <img
                src={imgError ? ytThumb(item.videoId, 'hqdefault') : ytThumb(item.videoId)}
                alt={item.title}
                loading="lazy"
                onError={() => setImgError(true)}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.7s var(--ease-expo), filter 0.5s',
                    transform: hov ? 'scale(1.06)' : 'scale(1)',
                    filter: hov ? 'brightness(0.7)' : 'brightness(0.45)',
                }}
            />

            {/* Play button */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: hov ? 1 : 0, transition: 'opacity 0.4s',
            }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(224,90,58,0.35)',
                    transform: hov ? 'scale(1)' : 'scale(0.7)',
                    transition: 'transform 0.4s var(--ease-expo)',
                }}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                        <path d="M2 1L16 10L2 19V1Z" fill="#fff" />
                    </svg>
                </div>
            </div>

            {/* Info overlay */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
            }}>
                {item.type && (
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
                        display: 'block', marginBottom: '0.25rem',
                    }}>{item.type}</span>
                )}
                <h3 style={{
                    fontSize: '1rem', fontWeight: 600, color: '#fff',
                    lineHeight: 1.3,
                }}>{item.title}</h3>
                {item.desc && (
                    <p style={{
                        fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
                        marginTop: '0.3rem', lineHeight: 1.4,
                        display: hov ? 'block' : 'none',
                    }}>{item.desc}</p>
                )}
            </div>

            {/* Index number */}
            <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontFamily: 'var(--font-en)', fontSize: '0.65rem',
                fontWeight: 700, color: 'rgba(255,255,255,0.1)',
            }}>{String(index + 1).padStart(2, '0')}</span>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   CATEGORY DETAIL PAGE (공통 템플릿)
   ═══════════════════════════════════════════════════ */
export default function CategoryDetail({
    category,    // { id, title, en, desc, color, icon }
    videos,      // [{ videoId, title, type, desc? }]
}) {
    const [lightbox, setLightbox] = useState(null);

    const openVideo = useCallback((videoId, title) => setLightbox({ videoId, title }), []);
    const closeVideo = useCallback(() => setLightbox(null), []);

    return (
        <div style={{
            background: 'var(--bg-void)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-kr)', minHeight: '100vh',
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
                <a
                    href="#interactive"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        color: 'var(--text-muted)', letterSpacing: '0.1em',
                        transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hero)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    ← BACK
                </a>
                <span style={{
                    fontFamily: 'var(--font-en)', fontSize: '1.1rem',
                    fontWeight: 700, color: 'var(--text-hero)',
                }}>
                    notoow<span style={{ color: 'var(--accent)' }}>.</span>
                </span>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: category.color, letterSpacing: '0.15em',
                }}>{category.en}</span>
            </nav>

            {/* ─── HERO ─── */}
            <section style={{
                height: '50vh', minHeight: '380px',
                display: 'flex', alignItems: 'flex-end',
                padding: '0 3rem 4rem', position: 'relative', overflow: 'hidden',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', top: '10%', right: '10%',
                    width: '500px', height: '500px',
                    background: `radial-gradient(circle, ${category.color}12, transparent 60%)`,
                    filter: 'blur(80px)', pointerEvents: 'none',
                }} />

                {/* Giant background text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-en)', fontSize: 'clamp(10rem, 20vw, 18rem)',
                    fontWeight: 900, color: 'rgba(255,255,255,0.02)',
                    letterSpacing: '-0.05em', userSelect: 'none', pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                }}>{category.en}</div>

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
                            background: category.color, display: 'inline-block',
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: category.color, letterSpacing: '0.15em',
                        }}>{category.en}</span>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-kr)',
                        fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                        fontWeight: 800, lineHeight: 1.1,
                        letterSpacing: '-0.03em', marginBottom: '1.2rem',
                    }}>
                        {category.title}
                        <span style={{ color: category.color }}>.</span>
                    </h1>

                    <p style={{
                        fontSize: '1rem', lineHeight: 1.75,
                        color: 'var(--text-secondary)', maxWidth: '520px',
                    }}>{category.desc}</p>

                    <div style={{
                        marginTop: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            color: 'var(--text-muted)', letterSpacing: '0.1em',
                        }}>
                            {videos.length} PROJECTS
                        </span>
                        <span style={{
                            width: '40px', height: '1px', background: 'var(--border)',
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            color: 'var(--text-muted)', letterSpacing: '0.1em',
                        }}>CLICK TO PLAY</span>
                    </div>
                </motion.div>
            </section>

            {/* ─── VIDEO GRID ─── */}
            <section style={{
                padding: '0 3rem 6rem',
                borderTop: '1px solid var(--border)',
            }}>
                <div style={{
                    maxWidth: '1300px', margin: '0 auto', paddingTop: '3rem',
                }}>
                    {/* Grid header */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '2.5rem',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: 'var(--text-muted)', letterSpacing: '0.15em',
                        }}>ALL PROJECTS</span>
                    </div>

                    {/* Masonry-ish grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                    }}>
                        {videos.map((v, i) => (
                            <VideoCard key={`${v.videoId}-${i}`} item={v} index={i} onPlay={openVideo} />
                        ))}
                    </div>

                    {/* Empty state */}
                    {videos.length === 0 && (
                        <div style={{
                            padding: '6rem 0', textAlign: 'center',
                        }}>
                            <p style={{
                                fontSize: '1.1rem', color: 'var(--text-muted)',
                            }}>아직 프로젝트가 추가되지 않았습니다.</p>
                            <p style={{
                                fontSize: '0.85rem', color: 'var(--text-dim)',
                                marginTop: '0.5rem',
                            }}>곧 업데이트됩니다 🎬</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer style={{
                padding: '2.5rem 3rem', borderTop: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1rem',
            }}>
                <a href="#interactive" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    transition: 'color 0.3s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hero)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >← BACK TO PORTFOLIO</a>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-muted)', letterSpacing: '0.12em',
                }}>© 2026 NOTOOW</span>
            </footer>

            {/* ─── LIGHTBOX ─── */}
            <AnimatePresence>
                {lightbox && (
                    <VideoLightbox
                        videoId={lightbox.videoId}
                        title={lightbox.title}
                        onClose={closeVideo}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
