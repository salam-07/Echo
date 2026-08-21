import React from 'react';
import Reveal from './Reveal';

const steps = [
    {
        step: '01',
        title: 'Create an account',
        description: 'Pick a username and a password. No email, no verification — nothing between you and your feed.',
    },
    {
        step: '02',
        title: 'Post your Echos',
        description: 'Share short text posts and tag them, so they are easy for you and others to find later.',
    },
    {
        step: '03',
        title: 'Build your Scrolls',
        description: 'Hand-pick a curation, or write a feed’s rules. Keep it private, or make it public and share it.',
    },
    {
        step: '04',
        title: 'Follow and grow',
        description: 'Follow the people worth reading and let their Echos flow into the feeds you have defined.',
    },
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="relative py-24 sm:py-28 lg:py-36 px-6 bg-base-200/30">
            <div className="container mx-auto max-w-5xl">
                {/* Intro */}
                <Reveal className="max-w-2xl mb-14 lg:mb-20">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-base-content mb-4">
                        Up and running in a few minutes.
                    </h2>
                    <p className="text-base sm:text-lg text-base-content/60 leading-relaxed">
                        Four steps from sign-up to a feed that answers to no one but you.
                    </p>
                </Reveal>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {steps.map(({ step, title, description }, i) => (
                        <Reveal key={step} delay={i * 0.06} className="pt-6 border-t border-base-300/60">
                            <div className="text-5xl font-extralight tracking-tight text-base-content/20 mb-5 tabular-nums">
                                {step}
                            </div>
                            <h3 className="text-lg font-medium text-base-content mb-2">{title}</h3>
                            <p className="text-sm text-base-content/60 leading-relaxed">{description}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
