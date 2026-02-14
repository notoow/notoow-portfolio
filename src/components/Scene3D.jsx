import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Clone, Float, useGLTF, Environment, Lightformer, Loader, Preload, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

/* ═══════════════════════════════════════════════════
   3D HERO SCENE — Floating geometric objects
   with mouse reactivity and post-processing
   ═══════════════════════════════════════════════════ */

export function HeroScene({ mousePos }) {
    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            pointerEvents: 'none',
        }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={isMobile ? [1, 2] : [1, 1.5]}
                gl={{ antialias: isMobile, alpha: true, powerPreference: "high-performance" }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-3, 2, 4]} intensity={2} color="#E05A3A" distance={12} />
                <pointLight position={[3, -2, 3]} intensity={2} color="#5DB8A8" distance={10} />

                <Suspense fallback={null}>
                    {isMobile ? <GyroTracker /> : <MouseTracker mousePos={mousePos} />}
                    <FloatingModels mousePos={mousePos} />
                    <Environment preset="city" />
                    <Preload all />
                </Suspense>

                <ParticleField count={isMobile ? 300 : 800} />

                <EffectComposer enabled={!isMobile}>
                    <Bloom
                        intensity={0.4}
                        luminanceThreshold={0.6}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                    <ChromaticAberration
                        blendFunction={BlendFunction.NORMAL}
                        offset={new THREE.Vector2(0.0008, 0.0008)}
                    />
                    <Vignette darkness={0.5} offset={0.3} />
                </EffectComposer>

            </Canvas>

            <MotionRequest />
        </div >
    );
}

/* ─── iOS Motion Permission Button ─── */
function MotionRequest() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if iOS 13+ permission API exists
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            setShow(true);
        }
    }, []);

    const requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === 'granted') {
                    setShow(false);
                }
            })
            .catch((e) => console.error(e));
    };

    if (!show) return null;

    return (
        <button
            onClick={requestAccess}
            style={{
                position: 'absolute', bottom: '80px', right: '20px', zIndex: 100,
                padding: '8px 16px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                cursor: 'pointer', outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
            ENABLE 3D 📱
        </button>
    );
}

/* ─── Mouse Tracker — smoothly moves the camera target ─── */
function MouseTracker({ mousePos }) {
    const { camera } = useThree();
    const targetRotation = useRef({ x: 0, y: 0 });

    useFrame(() => {
        targetRotation.current.x = mousePos.y * 0.08;
        targetRotation.current.y = mousePos.x * 0.12;

        camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03;
        camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03;
    });

    return null;
}

/* ─── Gyro Tracker (Mobile Tilt) ─── */
/* ─── Gyro Tracker (Mobile Tilt with Calibration) ─── */
function GyroTracker() {
    const { camera } = useThree();
    const target = useRef({ x: 0, y: 0 });
    const initial = useRef(null);

    useEffect(() => {
        const handleOrientation = (e) => {
            if (e.gamma === null || e.beta === null) return;

            // Calibrate on first valid reading
            if (!initial.current) {
                initial.current = { gamma: e.gamma, beta: e.beta };
            }

            // Calculate deltas
            const deltaGamma = e.gamma - initial.current.gamma;
            const deltaBeta = e.beta - initial.current.beta;

            // Clamp deltas to avoid extreme rotation
            const y = THREE.MathUtils.clamp(deltaGamma, -45, 45);
            const x = THREE.MathUtils.clamp(deltaBeta, -45, 45);

            // Map to camera rotation (softer sensitivity)
            target.current.y = (y / 45) * 0.3; // Limit to ~0.3 rad
            target.current.x = (x / 45) * 0.3;
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    useFrame(() => {
        // Smooth interpolation
        camera.rotation.x += (target.current.x - camera.rotation.x) * 0.05;
        camera.rotation.y += (target.current.y - camera.rotation.y) * 0.05;
    });

    return null;
}

/* ─── Floating 3D Models ─── */
function FloatingModels({ mousePos }) {
    // Load models
    const mac = useGLTF('macbook_pro_m3_16_inch_2024.glb');
    const camera = useGLTF('canon_at-2_retro_camera.glb');
    const vhs = useGLTF('vhs_tape.glb');
    const headphone = useGLTF('headphone_with_stand.glb');
    const mouse = useGLTF('logitech_mx_vertical_mouse.glb');
    const mic = useGLTF('microphone_gxl_066_bafhcteks.glb');
    const light = useGLTF('studio_umbrella_light.glb');
    const drone = useGLTF('dji_3_mini_pro.glb');
    const printer = useGLTF('3d_printer.glb');

    // Scale adjustment helper
    const S = isMobile ? 0.7 : 1;

    return (
        <group>
            {/* 1. MacBook — Top Right (Dev/Edit) */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <primitive
                    object={mac.scene}
                    scale={0.08 * S}
                    position={[3.5, 2, -2]}
                    rotation={[0.3, -0.5, 0.2]}
                />
            </Float>

            <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
                <Clone
                    object={camera.scene}
                    scale={9 * S}
                    position={[-3.2, -1.5, 1]}
                    rotation={[0.2, 0.5, 0]}
                />
            </Float>

            {/* 3. VHS Tape — Top Left (Retro/Edit) */}
            <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.5}>
                <primitive
                    object={vhs.scene}
                    scale={0.07 * S}
                    position={[-2.5, 2.8, -3]}
                    rotation={[1, 0.5, 0]}
                />
            </Float>

            {/* 4. Headphone — Far Right (Audio/Mood) */}
            <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
                <primitive
                    object={headphone.scene}
                    scale={5 * S}
                    position={[4.5, -1, -4]}
                    rotation={[0, -0.5, 0.2]}
                />
            </Float>

            {/* 5. Vertical Mouse — Center Left */}
            <Float speed={1} rotationIntensity={1.5} floatIntensity={1}>
                <primitive
                    object={mouse.scene}
                    scale={2.5 * S}
                    position={[-4, 0.5, -2]}
                    rotation={[0.2, 4.8, 0.2]}
                />
            </Float>

            {/* 6. Creative Core — Center Focal Point */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 1, -5]}>
                    <sphereGeometry args={[1.1, 64, 64]} />
                    <MeshDistortMaterial
                        color="#E05A3A"
                        emissive="#E05A3A"
                        emissiveIntensity={0.2}
                        roughness={0.2}
                        metalness={0.8}
                        distort={0.3}
                        speed={2}
                    />
                </mesh>
            </Float>

            {/* 6. Mic — Far Bottom (Recording) */}
            <Float speed={1} rotationIntensity={0.4} floatIntensity={0.5}>
                <primitive
                    object={mic.scene}
                    scale={0.8 * S}
                    position={[1.5, -2.5, -3]}
                    rotation={[0, 0, 0.3]}
                />
            </Float>

            {/* 7. Studio Light — Top Right Edge (Moved to avoid overlap) */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <primitive
                    object={light.scene}
                    scale={0.005 * S}
                    position={[-23, -1, -17]}
                    rotation={[0.5, 1.5, 0]}
                />
            </Float>

            {/* 8. Drone — Between Light & Mouse/Camera (Aerial) */}
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
                <primitive
                    object={drone.scene}
                    scale={3 * S}
                    position={[-5, 1.5, -2]}
                    rotation={[0.2, 0.5, 0.1]}
                />
            </Float>

            {/* 9. 3D Printer — Far Right (Opposite to Light) */}
            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
                <primitive
                    object={printer.scene}
                    scale={0.016 * S}
                    position={[8, -4, -3]}
                    rotation={[0.1, -0.5, 0]}
                />
            </Float>
        </group>
    );
}

// Preload to avoid pop-in
useGLTF.preload('macbook_pro_m3_16_inch_2024.glb');
useGLTF.preload('canon_at-2_retro_camera.glb');
useGLTF.preload('vhs_tape.glb');
useGLTF.preload('headphone_with_stand.glb');
useGLTF.preload('logitech_mx_vertical_mouse.glb');
useGLTF.preload('microphone_gxl_066_bafhcteks.glb');
useGLTF.preload('speaker_with_stand.glb');
useGLTF.preload('dji_3_mini_pro.glb');
useGLTF.preload('3d_printer.glb');

/* ─── Particle Field — thousands of tiny floating dots ─── */
function ParticleField({ count = 800 }) {
    const mesh = useRef();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            sizes[i] = Math.random() * 2 + 0.5;
        }

        return { positions, sizes };
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = clock.getElapsedTime() * 0.015;
        mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#ffffff"
                transparent
                opacity={0.25}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

/* ═══════════════════════════════════════════════════
   SKILLS 3D SCENE — per-skill floating object
   ═══════════════════════════════════════════════════ */
export function SkillScene({ skillId, isActive }) {
    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            pointerEvents: 'none',
            opacity: isActive ? 0.8 : 0.2, // Increased opacity for models
            transition: 'opacity 0.8s',
        }}>
            <Canvas
                frameloop={isActive ? "always" : "never"}
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={isMobile ? [1, 1] : [1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[3, 3, 3]} intensity={1.5} color="#E05A3A" />
                <pointLight position={[-3, -2, 5]} intensity={1.5} color="#5DB8A8" />

                <Suspense fallback={null}>
                    {/* Environment for reflections */}
                    <Environment preset="city" />
                    <SkillObject skillId={skillId} />
                </Suspense>

                {/* Bloom Effect - carefully tuned for models */}
                <EffectComposer enabled={isActive && !isMobile}>
                    <Bloom intensity={0.4} luminanceThreshold={0.85} mipmapBlur />
                </EffectComposer>
            </Canvas>
        </div >
    );
}

export function GlobalLoader() {
    return <Loader containerStyles={{ background: 'var(--bg-void)' }} innerStyles={{ width: '300px', background: 'var(--border)' }} barStyles={{ background: 'var(--accent)', height: '4px' }} dataStyles={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-hero)' }} />;
}

function SkillObject({ skillId }) {
    const ref = useRef();

    // Load models for skills
    const cam = useGLTF('canon_at-1_retro_camera.glb');
    const vhs = useGLTF('vhs_tape.glb');
    const speaker = useGLTF('speaker_with_stand.glb');
    const mac = useGLTF('macbook_pro_m3_16_inch_2024.glb');

    useFrame(({ clock }) => {
        if (!ref.current) return;
        // Gentle rotation
        ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.5;
        // bobbing
        ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    });

    const S = isMobile ? 0.6 : 1;

    let model = null;
    let scale = 1;
    let rotation = [0, 0, 0];

    // Mapping skillId to Model
    switch (skillId) {
        case 'film':
            model = cam.scene.clone(); // Clone to use multiple times
            scale = 8 * S;
            rotation = [0.2, -0.5, 0];
            break;
        case 'edit':
            model = vhs.scene.clone();
            scale = 0.08 * S;
            rotation = [1.5, 0, 0.5]; // Tilted tape
            break;
        case '3d':
            model = speaker.scene.clone();
            scale = 4.5 * S;
            rotation = [0, 0.5, 0];
            break;
        case 'dev':
            model = mac.scene.clone();
            scale = 0.08 * S;
            rotation = [0.2, -0.3, 0];
            break;
        default:
            model = mac.scene.clone();
    }

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <primitive
                ref={ref}
                object={model}
                scale={scale}
                rotation={rotation}
            />
        </Float>
    );
}

useGLTF.preload('/canon_at-1_retro_camera.glb');
useGLTF.preload('/vhs_tape.glb');
useGLTF.preload('/speaker_with_stand.glb');
useGLTF.preload('/macbook_pro_m3_16_inch_2024.glb');

/* ═══════════════════════════════════════════════════
   3D TILT CARD — mouse-reactive perspective
   ═══════════════════════════════════════════════════ */
export function useTilt3D() {
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        ref.current.style.transform = `
            perspective(800px)
            rotateY(${x * 12}deg)
            rotateX(${-y * 12}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    };

    return { ref, handleMouseMove, handleMouseLeave };
}

/* ═══════════════════════════════════════════════════
   CURSOR GLOW TRAIL
   ═══════════════════════════════════════════════════ */
export function CursorGlow() {
    const glowRef = useRef(null);
    const trailRefs = useRef([]);
    const positions = useRef(Array(5).fill({ x: 0, y: 0 }));

    React.useEffect(() => {
        let animFrame;
        const handler = (e) => {
            positions.current[0] = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handler);

        const animate = () => {
            // Main glow
            if (glowRef.current) {
                glowRef.current.style.left = positions.current[0].x + 'px';
                glowRef.current.style.top = positions.current[0].y + 'px';
            }

            // Trail dots — follow with delay
            for (let i = positions.current.length - 1; i > 0; i--) {
                positions.current[i] = {
                    x: positions.current[i].x + (positions.current[i - 1].x - positions.current[i].x) * 0.15,
                    y: positions.current[i].y + (positions.current[i - 1].y - positions.current[i].y) * 0.15,
                };
                if (trailRefs.current[i - 1]) {
                    trailRefs.current[i - 1].style.left = positions.current[i].x + 'px';
                    trailRefs.current[i - 1].style.top = positions.current[i].y + 'px';
                }
            }
            animFrame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', handler);
            cancelAnimationFrame(animFrame);
        };
    }, []);

    return (
        <>
            {/* Main glow */}
            <div ref={glowRef} style={{
                position: 'fixed', width: '250px', height: '250px',
                borderRadius: '50%', pointerEvents: 'none', zIndex: 9998,
                background: 'radial-gradient(circle, rgba(224,90,58,0.06), transparent 60%)',
                filter: 'blur(40px)',
                transform: 'translate(-50%, -50%)',
            }} />

            {/* Trail dots */}
            {Array(4).fill(null).map((_, i) => (
                <div
                    key={i}
                    ref={el => trailRefs.current[i] = el}
                    style={{
                        position: 'fixed',
                        width: `${8 - i * 1.5}px`, height: `${8 - i * 1.5}px`,
                        borderRadius: '50%', pointerEvents: 'none', zIndex: 9998,
                        background: `rgba(224, 90, 58, ${0.35 - i * 0.07})`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'none',
                    }}
                />
            ))}
        </>
    );
}
