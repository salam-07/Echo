import React from 'react';
import { UserPlus, PenLine, Library, Globe } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Create Your Account',
        description: 'Sign up in seconds and set up your profile to start sharing.',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: PenLine,
        step: '02',
        title: 'Share Your Echos',
        description: 'Post your thoughts, ideas, and insights with tags for discovery.',
        gradient: 'from-rose-500 to-pink-500',
    },
    {
        icon: Library,
        step: '03',
        title: 'Build Scrolls',
        description: 'Curate collections or create dynamic feeds from tagged content.',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        icon: Globe,
        step: '04',
        title: 'Connect & Grow',
        description: 'Engage with the community and grow your audience organically.',
        gradient: 'from-amber-500 to-orange-500',
    },
];

const HowItWorksSection = () => {
    return (
        <section
            id="how-it-works"
            className="relative py-20 lg:py-32 px-4 bg-base-200/30 overflow-hidden"
        >
            {/* Subtle background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-base-200 to-base-200/50 border border-base-300/50 rounded-full text-sm font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Simple steps to{' '}
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-500 bg-clip-text text-transparent">
                            get started
                        </span>
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

const StepCard = ({ icon: Icon, step, title, description, gradient, isLast }) => (
    <div className="relative">
        {/* Connector line (hidden on mobile and last item) */}
        {!isLast && (
            <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-base-300 to-base-300/0" />
        )}

        <div className="relative bg-base-100 p-6 rounded-2xl border border-base-200 hover:border-base-300 hover:shadow-lg transition-all duration-300">
            {/* Step number */}
            <span className={`text-4xl font-bold absolute top-4 right-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent opacity-30`}>
                {step}
            </span>

            {/* Icon */}
            <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${gradient} text-white rounded-xl mb-4`}>
                <Icon size={28} />
            </div>

            <h3 className="text-xl font-semibold text-neutral mb-2">{title}</h3>
            <p className="text-base-content/70">{description}</p>
        </div>
    </div>
);

export default HowItWorksSection;
