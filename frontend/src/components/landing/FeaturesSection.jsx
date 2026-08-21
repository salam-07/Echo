import React from 'react';
import { MessageCircle, Hash, Users, Search, Plus } from 'lucide-react';
import Reveal from './Reveal';

const supporting = [
    {
        icon: MessageCircle,
        title: 'Echos',
        description: 'Concise text posts, up to 1,000 characters. Tag them, like them, reply in threads.',
    },
    {
        icon: Hash,
        title: 'Tags',
        description: 'Globally unique tags are the backbone of discovery — and the rules behind every feed.',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Follow the people worth reading. Their Echos flow into the feeds you build.',
    },
    {
        icon: Search,
        title: 'Search',
        description: 'Find Echos, Scrolls, people, and tags across everything on the platform.',
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="relative py-24 sm:py-28 lg:py-36 px-6 bg-base-100">
            <div className="container mx-auto max-w-5xl">
                {/* Intro */}
                <Reveal className="max-w-2xl mb-14 lg:mb-20">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-base-content mb-4">
                        The pieces are yours.
                        <br className="hidden sm:block" />
                        <span className="text-base-content/40"> The algorithm isn't invited.</span>
                    </h2>
                    <p className="text-base sm:text-lg text-base-content/60 leading-relaxed">
                        Echo gives you a small, sharp set of tools. How you assemble them into a
                        reading experience is entirely up to you.
                    </p>
                </Reveal>

                {/* Lead feature — Scrolls */}
                <Reveal className="rounded-3xl border border-base-200 bg-base-100 overflow-hidden mb-6">
                    <div className="grid lg:grid-cols-2">
                        {/* Copy */}
                        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-base-content/40 mb-4">
                                Scrolls
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-base-content mb-4">
                                Two ways to curate.
                                <br />
                                One thing in common — you.
                            </h3>
                            <p className="text-base-content/60 leading-relaxed">
                                A <span className="text-base-content font-medium">Curation</span> is a list you
                                assemble by hand. A <span className="text-base-content font-medium">Feed</span> is a
                                transparent set of rules — tags, authors, dates, sort order — that you write yourself.
                                Either way, nothing decides for you.
                            </p>
                        </div>

                        {/* Visual — Curation vs Feed */}
                        <div className="relative p-8 sm:p-10 lg:p-12 bg-base-200/40 border-t lg:border-t-0 lg:border-l border-base-200">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {/* Curation */}
                                <div className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-base-content">Curation</span>
                                        <span className="text-[10px] uppercase tracking-wider text-base-content/40">Manual</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-base-200 flex-shrink-0" />
                                                <div className="h-2 rounded bg-base-200 flex-1" />
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2 text-base-content/40 pt-0.5">
                                            <div className="w-5 h-5 rounded-full border border-dashed border-base-300 flex items-center justify-center flex-shrink-0">
                                                <Plus size={11} />
                                            </div>
                                            <div className="h-2 rounded bg-base-200/50 flex-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Feed */}
                                <div className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-base-content">Feed</span>
                                        <span className="text-[10px] uppercase tracking-wider text-base-content/40">Rules</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {['#design', '#type', 'newest'].map((chip) => (
                                            <span
                                                key={chip}
                                                className="text-[10px] px-2 py-0.5 rounded-full border border-base-300 text-base-content/70"
                                            >
                                                {chip}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="space-y-2.5">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-base-200 flex-shrink-0" />
                                                <div className="h-2 rounded bg-base-200 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Supporting capabilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-14">
                    {supporting.map(({ icon: Icon, title, description }, i) => (
                        <Reveal key={title} delay={i * 0.05} className="pt-6 border-t border-base-200">
                            <Icon size={20} className="text-base-content mb-4" strokeWidth={1.75} />
                            <h3 className="text-lg font-medium text-base-content mb-1.5">{title}</h3>
                            <p className="text-sm text-base-content/60 leading-relaxed">{description}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
