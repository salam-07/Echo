import React from 'react';
import { UserPlus, PenLine, Library, Globe } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Create Your Account',
        description: 'Sign up in seconds and set up your profile to start sharing.',
    },
    {
        icon: PenLine,
        step: '02',
        title: 'Share Your Echos',
        description: 'Post your thoughts, ideas, and insights with tags for discovery.',
    },
    {
        icon: Library,
        step: '03',
        title: 'Build Scrolls',
        description: 'Curate collections or create dynamic feeds from tagged content.',
    },
    {
        icon: Globe,
        step: '04',
        title: 'Connect & Grow',
        description: 'Engage with the community and grow your audience organically.',
    },
];

const HowItWorksSection = () => {
    return (
        <section
            id="how-it-works"
            className="py-20 lg:py-32 px-4 bg-base-200/30"
        >
            <div className="container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-base-200 rounded-full text-sm font-medium mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Simple steps to get started
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Getting started with Echo takes just a few minutes. Here's how.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ icon: Icon, step, title, description, isLast }) => (
    <div className="relative">
        {/* Connector line (hidden on mobile and last item) */}
        {!isLast && (
            <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-base-300" />
        )}

        <div className="relative bg-base-100 p-6 rounded-2xl border border-base-300">
            {/* Step number */}
            <span className="text-4xl font-bold text-base-300 absolute top-4 right-4">
                {step}
            </span>

            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center bg-neutral text-neutral-content rounded-xl mb-4">
                <Icon size={28} />
            </div>

            <h3 className="text-xl font-semibold text-neutral mb-2">{title}</h3>
            <p className="text-base-content/70">{description}</p>
        </div>
    </div>
);

export default HowItWorksSection;
