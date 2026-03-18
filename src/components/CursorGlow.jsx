import { useEffect, useRef } from 'react';

export default function CursorGlow() {
    const glowRef = useRef(null);
    const position = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let animFrame;

        const handleMouseMove = (event) => {
            position.current = { x: event.clientX, y: event.clientY };
        };

        const animate = () => {
            if (glowRef.current) {
                glowRef.current.style.left = `${position.current.x}px`;
                glowRef.current.style.top = `${position.current.y}px`;
            }

            animFrame = window.requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.cancelAnimationFrame(animFrame);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            style={{
                position: 'fixed',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9998,
                background: 'radial-gradient(circle, rgba(224,90,58,0.06), transparent 60%)',
                filter: 'blur(40px)',
                transform: 'translate(-50%, -50%)',
            }}
        />
    );
}
