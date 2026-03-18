import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Preload, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export default function HeroScene({ mousePos }) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={isMobileViewport ? [1, 2] : [1, 1.5]}
                gl={{ antialias: isMobileViewport, alpha: true, powerPreference: 'high-performance' }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-3, 2, 4]} intensity={2} color="#E05A3A" distance={12} />
                <pointLight position={[3, -2, 3]} intensity={2} color="#5DB8A8" distance={10} />

                <Suspense fallback={null}>
                    {isMobileViewport ? <GyroTracker /> : <MouseTracker mousePos={mousePos} />}
                    <FloatingModels />
                    <Environment preset="city" />
                    <Preload all />
                </Suspense>

                <ParticleField count={isMobileViewport ? 300 : 800} />

                <EffectComposer enabled={!isMobileViewport}>
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
        </div>
    );
}

function MotionRequest() {
    const [show, setShow] = useState(() => (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    ));

    const requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === 'granted') {
                    setShow(false);
                }
            })
            .catch(() => setShow(false));
    };

    if (!show) return null;

    return (
        <button
            onClick={requestAccess}
            style={{
                position: 'absolute',
                bottom: '80px',
                right: '20px',
                zIndex: 100,
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'background 0.3s',
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
        >
            ENABLE 3D 📱
        </button>
    );
}

function MouseTracker({ mousePos }) {
    const { camera } = useThree();
    const targetRotation = useRef({ x: 0, y: 0 });

    useFrame(() => {
        targetRotation.current.x = mousePos.y * 0.08;
        targetRotation.current.y = mousePos.x * 0.12;

        // React Three Fiber cameras are imperative scene objects.
        /* eslint-disable react-hooks/immutability */
        camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03;
        camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03;
        /* eslint-enable react-hooks/immutability */
    });

    return null;
}

function GyroTracker() {
    const { camera } = useThree();
    const target = useRef({ x: 0, y: 0 });
    const initial = useRef(null);

    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.gamma === null || event.beta === null) return;

            if (!initial.current) {
                initial.current = { gamma: event.gamma, beta: event.beta };
            }

            const deltaGamma = event.gamma - initial.current.gamma;
            const deltaBeta = event.beta - initial.current.beta;

            const y = THREE.MathUtils.clamp(deltaGamma, -45, 45);
            const x = THREE.MathUtils.clamp(deltaBeta, -45, 45);

            target.current.y = (y / 45) * 0.3;
            target.current.x = (x / 45) * 0.3;
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    useFrame(() => {
        // React Three Fiber cameras are imperative scene objects.
        /* eslint-disable react-hooks/immutability */
        camera.rotation.x += (target.current.x - camera.rotation.x) * 0.05;
        camera.rotation.y += (target.current.y - camera.rotation.y) * 0.05;
        /* eslint-enable react-hooks/immutability */
    });

    return null;
}

function FloatingModels() {
    const mac = useGLTF(assetUrl('macbook_pro_m3_16_inch_2024.glb'));
    const camera = useGLTF(assetUrl('canon_at-2_retro_camera.glb'));
    const vhs = useGLTF(assetUrl('vhs_tape.glb'));
    const headphone = useGLTF(assetUrl('headphone_with_stand.glb'));
    const mouse = useGLTF(assetUrl('logitech_mx_vertical_mouse.glb'));
    const mic = useGLTF(assetUrl('microphone_gxl_066_bafhcteks.glb'));
    const light = useGLTF(assetUrl('studio_umbrella_light.glb'));
    const drone = useGLTF(assetUrl('dji_3_mini_pro.glb'));
    const printer = useGLTF(assetUrl('3d_printer.glb'));

    const scaleFactor = isMobileViewport ? 0.7 : 1;

    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <primitive
                    object={mac.scene}
                    scale={0.08 * scaleFactor}
                    position={[3.5, 2, -2]}
                    rotation={[0.3, -0.5, 0.2]}
                />
            </Float>

            <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
                <primitive
                    object={camera.scene}
                    scale={9 * scaleFactor}
                    position={[-3.2, -1.5, 1]}
                    rotation={[0.2, 0.5, 0]}
                />
            </Float>

            <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.5}>
                <primitive
                    object={vhs.scene}
                    scale={0.07 * scaleFactor}
                    position={[-2.5, 2.8, -3]}
                    rotation={[1, 0.5, 0]}
                />
            </Float>

            <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
                <primitive
                    object={headphone.scene}
                    scale={5 * scaleFactor}
                    position={[4.5, -1, -4]}
                    rotation={[0, -0.5, 0.2]}
                />
            </Float>

            <Float speed={1} rotationIntensity={1.5} floatIntensity={1}>
                <primitive
                    object={mouse.scene}
                    scale={2.5 * scaleFactor}
                    position={[-4, 0.5, -2]}
                    rotation={[0.2, 4.8, 0.2]}
                />
            </Float>

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

            <Float speed={1} rotationIntensity={0.4} floatIntensity={0.5}>
                <primitive
                    object={mic.scene}
                    scale={0.8 * scaleFactor}
                    position={[1.5, -2.5, -3]}
                    rotation={[0, 0, 0.3]}
                />
            </Float>

            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <primitive
                    object={light.scene}
                    scale={0.005 * scaleFactor}
                    position={[-23, -1, -17]}
                    rotation={[0.5, 1.5, 0]}
                />
            </Float>

            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
                <primitive
                    object={drone.scene}
                    scale={3 * scaleFactor}
                    position={[-5, 1.5, -2]}
                    rotation={[0.2, 0.5, 0.1]}
                />
            </Float>

            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
                <primitive
                    object={printer.scene}
                    scale={0.016 * scaleFactor}
                    position={[8, -4, -3]}
                    rotation={[0.1, -0.5, 0]}
                />
            </Float>
        </group>
    );
}

useGLTF.preload(assetUrl('macbook_pro_m3_16_inch_2024.glb'));
useGLTF.preload(assetUrl('canon_at-2_retro_camera.glb'));
useGLTF.preload(assetUrl('vhs_tape.glb'));
useGLTF.preload(assetUrl('headphone_with_stand.glb'));
useGLTF.preload(assetUrl('logitech_mx_vertical_mouse.glb'));
useGLTF.preload(assetUrl('microphone_gxl_066_bafhcteks.glb'));
useGLTF.preload(assetUrl('dji_3_mini_pro.glb'));
useGLTF.preload(assetUrl('3d_printer.glb'));

function ParticleField({ count = 800 }) {
    const mesh = useRef();

    const particles = useMemo(() => {
        let seed = count * 7919;
        const nextRandom = () => {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
        };

        const positions = new Float32Array(count * 3);

        for (let index = 0; index < count; index += 1) {
            positions[index * 3] = (nextRandom() - 0.5) * 25;
            positions[index * 3 + 1] = (nextRandom() - 0.5) * 20;
            positions[index * 3 + 2] = (nextRandom() - 0.5) * 15;
        }

        return positions;
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = clock.getElapsedTime() * 0.015;
        mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particles, 3]} />
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
