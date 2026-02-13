import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Environment, Lightformer, Loader } from '@react-three/drei';
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
                dpr={isMobile ? [1, 1] : [1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.15} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} color="#f5dfc8" />
                <pointLight position={[-3, 2, 4]} intensity={0.8} color="#E05A3A" distance={12} />
                <pointLight position={[3, -2, 3]} intensity={0.4} color="#5DB8A8" distance={10} />

                <MouseTracker mousePos={mousePos} />
                <FloatingObjects mousePos={mousePos} />
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
        </div>
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

/* ─── Floating geometric objects ─── */
function FloatingObjects({ mousePos }) {
    return (
        <group>
            {/* Main Torus — center-right, warm accent */}
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
                <mesh position={[2.8, 0.5, -1]}>
                    <torusGeometry args={[1.2, 0.35, 32, 64]} />
                    <MeshDistortMaterial
                        color="#E05A3A"
                        roughness={0.15}
                        metalness={0.9}
                        distort={0.15}
                        speed={2}
                    />
                </mesh>
            </Float>

            {/* Icosahedron — left side, glass-like */}
            <Float speed={2} rotationIntensity={1.2} floatIntensity={0.8}>
                <mesh position={[-3, -0.8, 0]}>
                    <icosahedronGeometry args={[0.9, 1]} />
                    <meshPhysicalMaterial
                        color="#7B94B8"
                        roughness={0.05}
                        metalness={0.95}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>
            </Float>

            {/* Octahedron — top left, mint */}
            <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1}>
                <mesh position={[-1.5, 2, -2]}>
                    <octahedronGeometry args={[0.6, 0]} />
                    <meshPhysicalMaterial
                        color="#5DB8A8"
                        roughness={0.1}
                        metalness={0.85}
                        clearcoat={0.8}
                    />
                </mesh>
            </Float>

            {/* Small sphere cluster — scattered */}
            <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
                <mesh position={[1, -2, -1.5]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <MeshDistortMaterial
                        color="#A57DC8"
                        roughness={0.2}
                        metalness={0.8}
                        distort={0.3}
                        speed={3}
                    />
                </mesh>
            </Float>

            {/* Dodecahedron — far right */}
            <Float speed={1.2} rotationIntensity={2} floatIntensity={0.6}>
                <mesh position={[4, 1.5, -3]}>
                    <dodecahedronGeometry args={[0.5, 0]} />
                    <meshPhysicalMaterial
                        color="#C4806A"
                        roughness={0.08}
                        metalness={0.95}
                        clearcoat={1}
                    />
                </mesh>
            </Float>

            {/* Tiny accent spheres */}
            {[
                [0.5, 2.5, -2, '#E05A3A', 0.15],
                [-2.5, 1.5, -3, '#5DB8A8', 0.12],
                [3.5, -1.5, -2.5, '#A57DC8', 0.1],
                [-0.8, -2.2, -1, '#C4806A', 0.18],
                [2, 2.8, -4, '#7B94B8', 0.13],
            ].map(([x, y, z, color, size], i) => (
                <Float key={i} speed={3 + i * 0.5} rotationIntensity={0.3} floatIntensity={2}>
                    <mesh position={[x, y, z]}>
                        <sphereGeometry args={[size, 16, 16]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.5}
                            roughness={0.3}
                            metalness={0.7}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

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
            opacity: isActive ? 0.6 : 0.2,
            transition: 'opacity 0.8s',
        }}>
            <Canvas
                frameloop={isActive ? "always" : "never"}
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={isMobile ? [1, 1] : [1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[3, 3, 3]} intensity={0.8} color="#E05A3A" />

                <SkillObject skillId={skillId} />

                <EffectComposer enabled={isActive && !isMobile}>
                    <Bloom intensity={0.3} luminanceThreshold={0.7} mipmapBlur />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

export function GlobalLoader() {
    return <Loader containerStyles={{ background: 'var(--bg-void)' }} innerStyles={{ width: '300px', background: 'var(--border)' }} barStyles={{ background: 'var(--accent)', height: '4px' }} dataStyles={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-hero)' }} />;
}

function SkillObject({ skillId }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.x = clock.getElapsedTime() * 0.3;
        ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    });

    const configs = {
        film: { geo: <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />, color: '#C4806A' },
        edit: { geo: <torusGeometry args={[0.9, 0.3, 32, 64]} />, color: '#7B94B8' },
        '3d': { geo: <icosahedronGeometry args={[1, 1]} />, color: '#A57DC8' },
        dev: { geo: <octahedronGeometry args={[1, 2]} />, color: '#5DB8A8' },
    };

    const cfg = configs[skillId] || configs.film;

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={ref}>
                {cfg.geo}
                <MeshDistortMaterial
                    color={cfg.color}
                    roughness={0.12}
                    metalness={0.9}
                    distort={0.2}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

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
