import React, { useMemo } from 'react';
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

const ScrollCard = React.memo(({ title, color }) => (
    <div className="flex-shrink-0 w-28 sm:w-32 lg:w-36 h-40 sm:h-48 lg:h-56 bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
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

    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient masks - positioned to match card height */}
            <div className="absolute left-0 top-4 bottom-4 w-8 sm:w-16 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-4 bottom-4 w-8 sm:w-16 bg-gradient-to-l from-pink-500/10 to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div
                className="flex gap-3 sm:gap-4 py-4 animate-scroll"
                style={{
                    width: 'max-content',
                }}
            >
                {items.map((scroll, idx) => (
                    <ScrollCard key={`${scroll.title}-${idx}`} {...scroll} />
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
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default ScrollsAnimation;
