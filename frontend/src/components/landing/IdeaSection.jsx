import React from 'react';
import { Check, Minus } from 'lucide-react';
import Reveal from './Reveal';

const usualFeed = [
    'An algorithm you can’t see decides the order',
    'Tuned to keep you scrolling',
    'You can’t inspect it or change it',
];

const yourFeed = [
    'Rules you wrote, in plain sight',
    'Tuned for what you actually want',
    'Rewrite, reorder, or start over anytime',
];

const IdeaSection = () => {
    return (
        <section id="idea" className="relative py-24 sm:py-28 lg:py-36 px-6 bg-base-100">
            <div className="container mx-auto max-w-5xl">
                {/* Statement */}
                <Reveal className="max-w-3xl mb-14 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-base-content leading-[1.1]">
                        You decide what you see.
                        <span className="block text-base-content/40">
                            Not a machine optimising for your attention.
                        </span>
                    </h2>
                </Reveal>

                {/* The mechanism, honestly compared */}
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                    {/* The usual feed */}
                    <Reveal className="rounded-3xl border border-base-200 bg-base-100 p-8 sm:p-10">
                        <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-base-content/40 mb-6">
                            The usual feed
                        </h3>
                        <ul className="space-y-4">
                            {usualFeed.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <Minus size={18} className="text-base-content/30 mt-0.5 flex-shrink-0" />
                                    <span className="text-base-content/55 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    {/* Your Echo feed */}
                    <Reveal delay={0.08} className="rounded-3xl bg-neutral text-neutral-content p-8 sm:p-10 shadow-lg shadow-base-content/10">
                        <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-content/50 mb-6">
                            Your Echo feed
                        </h3>
                        <ul className="space-y-4">
                            {yourFeed.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <Check size={18} className="text-neutral-content mt-0.5 flex-shrink-0" strokeWidth={2.25} />
                                    <span className="text-neutral-content/85 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default IdeaSection;
