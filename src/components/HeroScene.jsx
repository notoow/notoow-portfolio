import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const getScreenAngle = () => {
    if (typeof window === 'undefined') return 0;
    if (typeof window.screen?.orientation?.angle === 'number') return window.screen.orientation.angle;
    if (typeof window.orientation === 'number') return window.orientation;
    return 0;
};
const shortestAngleDelta = (current, initial) => {
    let delta = current - initial;

    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    return delta;
};

if (typeof THREE.setConsoleFunction === 'function') {
    THREE.setConsoleFunction((level, message, ...params) => {
        if (level === 'log' && typeof message === 'string' && message.includes('THREE.WebGLRenderer: Context Lost.')) {
            return;
        }

        const method = console[level] || console.log;
        method(message, ...params);
    });
}

const HeroScene = React.memo(function HeroScene({ isMobile = false, onReady }) {
    const [isVisible, setIsVisible] = useState(false);
    const viewportMode = isMobile ? 'mobile' : 'desktop';

    const handleReady = () => {
        setIsVisible(true);
        onReady?.();
    };

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.9s var(--ease-expo)',
            }}
        >
            <Canvas
                key={viewportMode}
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={isMobile ? [1, 1] : [1, 1.05]}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                performance={{ min: 0.8 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-3, 2, 4]} intensity={2} color="#E05A3A" distance={12} />
                <pointLight position={[3, -2, 3]} intensity={2} color="#5DB8A8" distance={10} />

                <Suspense fallback={null}>
                    <SceneContent isMobile={isMobile} onReady={handleReady} />
                </Suspense>

                <EffectComposer enabled={!isMobile}>
                    <Bloom
                        intensity={0.28}
                        luminanceThreshold={0.72}
                        luminanceSmoothing={0.92}
                    />
                </EffectComposer>
            </Canvas>

            <MotionRequest isMobile={isMobile} />
        </div>
    );
});

export default HeroScene;

function SceneContent({ isMobile, onReady }) {
    const didReportReady = useRef(false);
    const pointerRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (didReportReady.current) return;
        didReportReady.current = true;
        const frameId = window.requestAnimationFrame(() => onReady?.());
        return () => window.cancelAnimationFrame(frameId);
    }, [onReady]);

    return (
        <>
            {isMobile ? <GyroTracker /> : <MouseTracker pointerRef={pointerRef} />}
            <FloatingModels isMobile={isMobile} pointerRef={pointerRef} />
            <Environment preset="city" resolution={64} />
            <ParticleField count={isMobile ? 90 : 220} />
        </>
    );
}

function MotionRequest({ isMobile }) {
    const [dismissed, setDismissed] = useState(false);
    const canRequestMotion = (
        isMobile &&
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    );

    const requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === 'granted') {
                    setDismissed(true);
                }
            })
            .catch(() => setDismissed(true));
    };

    if (!canRequestMotion || dismissed) return null;

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

function MouseTracker({ pointerRef }) {
    const { camera } = useThree();
    const pointer = pointerRef;

    useEffect(() => {
        const handleMouseMove = (event) => {
            pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
            pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
        };

        const resetPointer = () => {
            pointer.current.x = 0;
            pointer.current.y = 0;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('blur', resetPointer);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('blur', resetPointer);
        };
    }, [pointer]);

    useFrame(() => {
        const targetX = pointer.current.y * 0.16;
        const targetY = pointer.current.x * 0.24;
        const targetPositionX = pointer.current.x * 0.28;
        const targetPositionY = pointer.current.y * 0.18;

        // React Three Fiber cameras are imperative scene objects.
        /* eslint-disable react-hooks/immutability */
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetX, 0.18);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetY, 0.18);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPositionX, 0.14);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPositionY, 0.14);
        /* eslint-enable react-hooks/immutability */
    });

    return null;
}

function GyroTracker() {
    const { camera } = useThree();
    const target = useRef({ x: 0, y: 0 });
    const smoothed = useRef({ x: 0, y: 0 });
    const baseline = useRef(null);
    const screenAngle = useRef(getScreenAngle());

    useEffect(() => {
        const resetBaseline = () => {
            baseline.current = null;
        };

        const handleOrientation = (event) => {
            if (event.gamma === null || event.beta === null) return;

            const angle = getScreenAngle();
            if (!baseline.current || angle !== screenAngle.current) {
                baseline.current = { gamma: event.gamma, beta: event.beta };
                screenAngle.current = angle;
                target.current.x = 0;
                target.current.y = 0;
                smoothed.current.x = 0;
                smoothed.current.y = 0;
                return;
            }

            const deltaGamma = shortestAngleDelta(event.gamma, baseline.current.gamma);
            const deltaBeta = shortestAngleDelta(event.beta, baseline.current.beta);

            const y = THREE.MathUtils.clamp(deltaGamma, -30, 30);
            const x = THREE.MathUtils.clamp(deltaBeta, -26, 26);

            target.current.y = (y / 30) * 0.2;
            target.current.x = (x / 26) * 0.16;
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('orientationchange', resetBaseline);
        window.addEventListener('blur', resetBaseline);
        document.addEventListener('visibilitychange', resetBaseline);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('orientationchange', resetBaseline);
            window.removeEventListener('blur', resetBaseline);
            document.removeEventListener('visibilitychange', resetBaseline);
        };
    }, []);

    useFrame(() => {
        smoothed.current.x = THREE.MathUtils.lerp(smoothed.current.x, target.current.x, 0.12);
        smoothed.current.y = THREE.MathUtils.lerp(smoothed.current.y, target.current.y, 0.12);

        // React Three Fiber cameras are imperative scene objects.
        /* eslint-disable react-hooks/immutability */
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, smoothed.current.x, 0.12);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, smoothed.current.y, 0.12);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, smoothed.current.y * 0.45, 0.08);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, smoothed.current.x * 0.32, 0.08);
        /* eslint-enable react-hooks/immutability */
    });

    return null;
}

function FloatingModels({ isMobile, pointerRef }) {
    const mac = useGLTF(assetUrl('macbook_pro_m3_16_inch_2024.glb'));
    const camera = useGLTF(assetUrl('canon_at-2_retro_camera.glb'));
    const vhs = useGLTF(assetUrl('vhs_tape.glb'));
    const mic = useGLTF(assetUrl('microphone_gxl_066_bafhcteks.glb'));
    const light = useGLTF(assetUrl('studio_umbrella_light.glb'));
    const drone = useGLTF(assetUrl('dji_3_mini_pro.glb'));
    const printer = useGLTF(assetUrl('3d_printer.glb'));

    const scaleFactor = isMobile ? 0.7 : 1;
    const groupRef = useRef(null);

    useFrame(() => {
        if (!groupRef.current || !pointerRef) return;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            pointerRef.current.y * -0.08,
            0.16,
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            pointerRef.current.x * 0.12,
            0.16,
        );
        groupRef.current.position.x = THREE.MathUtils.lerp(
            groupRef.current.position.x,
            pointerRef.current.x * 0.28,
            0.12,
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
            groupRef.current.position.y,
            pointerRef.current.y * 0.14,
            0.12,
        );
    });

    return (
        <group ref={groupRef}>
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

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 1, -5]}>
                    <sphereGeometry args={[1.1, 32, 32]} />
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
                    scale={0.72 * scaleFactor}
                    position={[1.5, -2.5, -3]}
                    rotation={[0, 0, 0.3]}
                />
            </Float>

            <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.4}>
                <primitive
                    object={light.scene}
                    scale={0.0046 * scaleFactor}
                    position={[-22, -1.2, -17]}
                    rotation={[0.45, 1.5, 0]}
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

            <Float speed={0.75} rotationIntensity={0.25} floatIntensity={0.45}>
                <primitive
                    object={printer.scene}
                    scale={0.015 * scaleFactor}
                    position={[8.5, -4.1, -3.4]}
                    rotation={[0.1, -0.5, 0]}
                />
            </Float>
        </group>
    );
}

useGLTF.preload(assetUrl('macbook_pro_m3_16_inch_2024.glb'));
useGLTF.preload(assetUrl('canon_at-2_retro_camera.glb'));
useGLTF.preload(assetUrl('vhs_tape.glb'));
useGLTF.preload(assetUrl('microphone_gxl_066_bafhcteks.glb'));
useGLTF.preload(assetUrl('studio_umbrella_light.glb'));
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
