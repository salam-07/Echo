import React, { useEffect, useRef, useState } from 'react';

const reducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Subtle, robust scroll reveal. Fades + lifts a block into place once, the
 * first time it enters the viewport. Respects prefers-reduced-motion (renders
 * immediately visible) and needs no ScrollTrigger wiring.
 */
const Reveal = ({
    children,
    as: Tag = 'div',
    className = '',
    delay = 0,
    y = 18,
    ...props
}) => {
    const ref = useRef(null);
    const [shown, setShown] = useState(() => reducedMotion());

    useEffect(() => {
        if (shown) return;
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setShown(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [shown]);

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : `translateY(${y}px)`,
                transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                willChange: shown ? 'auto' : 'opacity, transform',
            }}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
