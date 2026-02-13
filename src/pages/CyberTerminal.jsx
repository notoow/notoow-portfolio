import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Monitor, Video, Code, Palette, Play } from 'lucide-react';


const FILES = {
    'projects': [
        { id: 'vid_01', name: 'cinematic_travel_vlog.mp4', type: 'video', size: '2.4GB', date: '2025-01-15', desc: '4K Cinematic Travel Vlog - Edited in Premiere Pro' },
        { id: 'vid_02', name: '3d_motion_reel.mov', type: 'video', size: '1.8GB', date: '2024-11-20', desc: 'C4D & After Effects motion graphics showcase' },
        { id: 'vid_03', name: 'commercial_shoot_bts.mp4', type: 'video', size: '850MB', date: '2024-10-05', desc: 'Behind the scenes of tech commercial shoot' },
    ],
    'code': [
        { id: 'dev_01', name: 'portfolio_source.js', type: 'code', size: '12KB', date: '2026-02-12', desc: 'Source code for this interactive terminal' },
        { id: 'dev_02', name: 'video_processing_script.py', type: 'code', size: '4KB', date: '2025-12-01', desc: 'Python script for automating ffmpeg tasks' },
    ],
    'design': [
        { id: 'art_01', name: 'color_grade_lut_pack.cube', type: 'data', size: '25MB', date: '2024-09-10', desc: 'Custom LUTs created for sci-fi aesthetic' },
        { id: 'art_02', name: 'thumb_design_v3.psd', type: 'image', size: '45MB', date: '2025-02-01', desc: 'YouTube thumbnail design variants' },
    ]
};

export default function CyberTerminal() {
    const [history, setHistory] = useState(['Welcome to Notoow OS v2.0', 'Type "help" for available commands.']);
    const [input, setInput] = useState('');
    const [activeVideo, setActiveVideo] = useState(null);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const args = cmd.split(' ');
            const command = args[0];
            const param = args[1];

            setHistory(prev => [...prev, `root@notoow:~ $ ${input}`]);

            switch (command) {
                case 'help':
                    setHistory(prev => [...prev,
                        'Available commands:',
                        '  ls [dir]    List directory contents (projects, code, design)',
                        '  cat [file]  View file details',
                        '  play [file] Open multimedia file',
                        '  clear       Clear terminal output',
                        '  exit        Return to main selection'
                    ]);
                    break;
                case 'ls':
                    if (!param) {
                        setHistory(prev => [...prev, 'Directories:', '  /projects/', '  /code/', '  /design/']);
                    } else if (FILES[param]) {
                        setHistory(prev => [...prev, `Contents of /${param}/:`, ...FILES[param].map(f => `  ${f.name}  [${f.size}]`)]);
                    } else {
                        setHistory(prev => [...prev, `Directory not found: ${param}`]);
                    }
                    break;
                case 'cat':
                    const file = Object.values(FILES).flat().find(f => f.name === param);
                    if (file) {
                        setHistory(prev => [...prev, `File: ${file.name}`, `Type: ${file.type}`, `Date: ${file.date}`, `Description: ${file.desc}`]);
                    } else {
                        setHistory(prev => [...prev, `File not found: ${param}`]);
                    }
                    break;
                case 'play':
                    const videoFile = Object.values(FILES).flat().find(f => f.name === param);
                    if (videoFile) {
                        setHistory(prev => [...prev, `Launching viewer for ${videoFile.name}...`]);
                        setActiveVideo(videoFile);
                    } else {
                        setHistory(prev => [...prev, `File not found: ${param}`]);
                    }
                    break;
                case 'clear':
                    setHistory([]);
                    break;
                case 'exit':
                    window.location.href = '/';
                    break;
                case '':
                    break;
                default:
                    setHistory(prev => [...prev, `Command not found: ${command}`]);
            }
            setInput('');
        }
    };

    return (
        <div style={{
            backgroundColor: '#0a0a0a',
            color: '#00ff00',
            minHeight: '100vh',
            fontFamily: "'Roboto Mono', monospace",
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* CRT Scanline Effect */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%',
                pointerEvents: 'none',
                zIndex: 10
            }} />

            <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #00ff00', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Terminal size={20} />
                    <span>OTOOW_SYSTEM_V2</span>
                </div>
                <a href="#home" style={{ color: '#00ff00', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    [ DISCONNECT ]
                </a>
            </nav>

            <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {history.map((line, i) => (
                    <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '0.5rem' }}>{line}</div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '0.5rem' }}>root@notoow:~ $</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00ff00',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            outline: 'none',
                            width: '100%',
                            caretColor: '#00ff00'
                        }}
                        autoFocus
                    />
                </div>
                <div ref={bottomRef} />
            </div>

            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: '#000',
                            border: '2px solid #00ff00',
                            padding: '1rem',
                            zIndex: 50,
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            boxShadow: '0 0 50px rgba(0, 255, 0, 0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #003300', paddingBottom: '0.5rem' }}>
                            <span>{activeVideo.name}</span>
                            <button
                                onClick={() => setActiveVideo(null)}
                                style={{ background: 'none', border: 'none', color: '#00ff00', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                [X]
                            </button>
                        </div>
                        <div style={{ width: '640px', height: '360px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            {/* Placeholder for actual video embed */}
                            <Play size={48} />
                            <p style={{ marginTop: '1rem' }}>Initiating Playback Sequence...</p>
                            <p style={{ fontSize: '0.8rem', color: '#444' }}>{activeVideo.desc}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Access Menu for user convenience */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                <button
                    onClick={() => { setInput('ls projects'); inputRef.current.focus(); }}
                    style={{ background: 'transparent', border: '1px solid #004400', color: '#008800', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                    LS PROJECTS
                </button>
                <button
                    onClick={() => { setInput('ls code'); inputRef.current.focus(); }}
                    style={{ background: 'transparent', border: '1px solid #004400', color: '#008800', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                    LS CODE
                </button>
            </div>

        </div>
    );
}
