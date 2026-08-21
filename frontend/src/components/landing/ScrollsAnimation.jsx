import React, { useMemo } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

// Illustrative example Scrolls — labelled as examples in the hero, never
// presented as real accounts or counts.
const scrolls = [
    'Tech', 'Literature', 'World News', 'AI & ML', 'Crypto',
    'Gaming', 'Memes', 'Politics', 'Science', 'Music',
    'Movies', 'Sports', 'Finance', 'Art', 'Climate',
    'Startups', 'No Cap', 'Brainrot', 'Sigma',
];

// Three monochrome header treatments, cycled to give the marquee rhythm
// without introducing off-brand colour.
const headerVariants = [
    'bg-neutral text-neutral-content',
    'bg-base-200 text-base-content',
    'bg-base-100 text-base-content border-b border-base-200',
];

const ScrollCard = React.memo(({ title, variant }) => (
    <div className="flex-shrink-0 w-28 sm:w-32 lg:w-36 h-40 sm:h-48 lg:h-56 bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`${headerVariants[variant]} flex items-center gap-1.5 px-2.5 py-2 sm:py-2.5`}>
            <span className="font-semibold text-xs sm:text-sm tracking-tight truncate block">{title}</span>
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
                    <div className="flex items-center gap-2 ml-5 sm:ml-6 pt-0.5">
                        <Heart size={10} className="text-base-300" />
                        <MessageCircle size={10} className="text-base-300" />
                    </div>
                </div>
            ))}
        </div>
    </div>
));

ScrollCard.displayName = 'ScrollCard';

const ScrollsAnimation = () => {
    // Duplicate for a seamless loop.
    const items = useMemo(() => [...scrolls, ...scrolls], []);

    return (
        <div className="relative w-full overflow-hidden">
            {/* Edge fades — both sides tinted from the page background, not colour. */}
            <div className="absolute left-0 top-4 bottom-4 w-10 sm:w-24 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-4 bottom-4 w-10 sm:w-24 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div
                className="flex gap-3 sm:gap-4 py-4 animate-scroll"
                style={{ width: 'max-content' }}
            >
                {items.map((title, idx) => (
                    <ScrollCard key={`${title}-${idx}`} title={title} variant={idx % headerVariants.length} />
                ))}
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-scroll { animation: none; }
                }
            `}</style>
        </div>
    );
};

export default ScrollsAnimation;
