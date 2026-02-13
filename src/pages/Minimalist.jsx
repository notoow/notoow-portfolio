import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function Minimalist() {
    const fadeInUp = {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '4rem 2rem',
            backgroundColor: '#f9f9f9',
            color: '#333',
            fontFamily: "'Inter', sans-serif",
            minHeight: '100vh'
        }}>
            <nav style={{ marginBottom: '4rem' }}>
                <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Styles
                </a>
            </nav>

            <header style={{ marginBottom: '6rem' }}>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '4rem',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}
                >
                    Notoow<br />Portfolio.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ fontSize: '1.2rem', color: '#666', maxWidth: '400px', lineHeight: 1.6 }}
                >
                    Crafting digital experiences with precision and clarity. Based in the cloud.
                </motion.p>
            </header>

            <main>
                <Section title="Selected Works">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        <VideoCard
                            title="Cinematic Travel Vlog"
                            category="Editing & Color"
                            image="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        />
                        <VideoCard
                            title="Tech Product Commercial"
                            category="Production & 3D"
                            image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        />
                        <VideoCard
                            title="Music Video Production"
                            category="Directing"
                            image="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        />
                        <VideoCard
                            title="Documentary Series"
                            category="Premiere Pro Workflow"
                            image="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        />
                    </div>
                </Section>

                <Section title="Filming Locations">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '400px' }}>
                        <div style={{ background: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80) center/cover', borderRadius: '4px' }} />
                        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80) center/cover', borderRadius: '4px' }} />
                            <div style={{ background: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80) center/cover', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        Exploration across diverse landscapes to capture the perfect shot.
                    </p>
                </Section>

                <Section title="Expertise">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <SkillList
                            title="Post-Production"
                            items={['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design']}
                        />
                        <SkillList
                            title="Development & 3D"
                            items={['React / Next.js', 'Cinema 4D', 'Blender', 'WebGL / Three.js']}
                        />
                    </div>
                </Section>

                <Section title="Contact">
                    <a href="mailto:hello@example.com" style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", textDecoration: 'underline', textUnderlineOffset: '8px' }}>
                        Get in touch &rarr;
                    </a>
                </Section>
            </main>

            <footer style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                <span>© 2026 Notoow</span>
                <span>Minimalist Edition</span>
            </footer>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <motion.section
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '6rem' }}
        >
            <h2 style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#999',
                marginBottom: '2rem',
                borderBottom: '1px solid #eee',
                paddingBottom: '1rem'
            }}>
                {title}
            </h2>
            {children}
        </motion.section>
    );
}

function VideoCard({ title, category, image }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            style={{ cursor: 'pointer' }}
        >
            <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '1rem',
                backgroundColor: '#eee'
            }}>
                <motion.img
                    src={image}
                    alt={title}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    opacity: 0
                }}
                    className="overlay" // In real CSS this would handle hover. For simplicity used inline styles or motion.
                >
                    {/* Play icon could go here */}
                </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{title}</h3>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>{category}</span>
        </motion.div>
    );
}

function SkillList({ title, items }) {
    return (
        <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map(item => (
                    <li key={item} style={{ marginBottom: '0.5rem', color: '#555' }}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
