import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Heart, Share2 } from 'lucide-react';

const scrolls = [
    { title: 'Tech', color: 'bg-violet-500' },
    { title: 'Literature', color: 'bg-emerald-600' },
    { title: 'World News', color: 'bg-blue-500' },
    { title: 'AI & ML', color: 'bg-purple-500' },
    { title: 'Crypto', color: 'bg-amber-500' },
    { title: 'Gaming', color: 'bg-rose-500' },
    { title: 'Memes', color: 'bg-pink-500' },
    { title: 'Politics', color: 'bg-red-600' },
    { title: 'Science', color: 'bg-cyan-500' },
    { title: 'Music', color: 'bg-fuchsia-500' },
    { title: 'Movies', color: 'bg-orange-500' },
    { title: 'Sports', color: 'bg-green-500' },
    { title: 'Finance', color: 'bg-slate-600' },
    { title: 'Art', color: 'bg-indigo-500' },
    { title: 'Climate', color: 'bg-teal-500' },
    { title: 'Startups', color: 'bg-yellow-500' },
    { title: 'No Cap', color: 'bg-zinc-600' },
    { title: 'Brainrot', color: 'bg-lime-500' },
    { title: 'Sigma', color: 'bg-neutral-600' },
];

const ScrollCard = React.memo(({ title, color, scale = 1 }) => (
    <div
        className="flex-shrink-0 w-28 sm:w-32 lg:w-36 h-40 sm:h-48 lg:h-56 bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden transition-transform duration-150 ease-out"
        style={{
            transform: `scale(${scale})`,
            zIndex: Math.round(scale * 10),
        }}
    >
        {/* Header */}
        <div className={`${color} px-2.5 py-2 sm:py-2.5`}>
            <span className="text-white font-semibold text-xs sm:text-sm truncate block">{title}</span>
        </div>
        {/* Skeleton posts */}
        <div className="p-2 sm:p-2.5 space-y-2 sm:space-y-2.5">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-base-200 flex-shrink-0" />
                        <div className="h-1.5 sm:h-2 bg-base-200 rounded flex-1" />
                    </div>
                    <div className="h-1 sm:h-1.5 bg-base-200/60 rounded w-4/5 ml-5 sm:ml-6" />
                    <div className="flex items-center gap-2 ml-5 sm:ml-6">
                        <Heart size={10} className="text-base-300" />
                        <Share2 size={10} className="text-base-300" />
                    </div>
                </div>
            ))}
        </div>
    </div>
));

ScrollCard.displayName = 'ScrollCard';

const ScrollsAnimation = () => {
    // Duplicate for seamless loop
    const items = useMemo(() => [...scrolls, ...scrolls], []);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const [scales, setScales] = useState(() => items.map(() => 1));
    const animationRef = useRef(null);

    const calculateScales = useCallback(() => {
        if (!containerRef.current || !trackRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const cards = trackRef.current.children;
        const newScales = [];

        for (let i = 0; i < cards.length; i++) {
            const cardRect = cards[i].getBoundingClientRect();
            const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
            const distanceFromCenter = Math.abs(cardCenterX - centerX);

            // Scale range: cards within ~200px of center get scaled up
            const maxDistance = 180;
            const minScale = 0.85;
            const maxScale = 1.15;

            if (distanceFromCenter < maxDistance) {
                // Smooth curve for scaling - closer to center = bigger
                const normalizedDistance = distanceFromCenter / maxDistance;
                const scaleFactor = 1 - normalizedDistance * normalizedDistance; // Quadratic ease
                const scale = minScale + (maxScale - minScale) * scaleFactor;
                newScales.push(scale);
            } else {
                newScales.push(minScale);
            }
        }

        setScales(newScales);
    }, []);

    useEffect(() => {
        const animate = () => {
            calculateScales();
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [calculateScales]);

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden">
            {/* Gradient masks - positioned to match card height */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-base-100 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-base-100 to-transparent z-20 pointer-events-none" />

            {/* Scrolling track */}
            <div
                ref={trackRef}
                className="flex gap-3 sm:gap-4 py-8 animate-scroll items-center"
                style={{
                    width: 'max-content',
                }}
            >
                {items.map((scroll, idx) => (
                    <ScrollCard
                        key={`${scroll.title}-${idx}`}
                        {...scroll}
                        scale={scales[idx] || 1}
                    />
                ))}
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ScrollsAnimation;
