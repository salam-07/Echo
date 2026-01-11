import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScrollsAnimation from './ScrollsAnimation';

const HeroSection = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const animationRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Title words animation
        tl.fromTo(
            '.hero-title-word',
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }
        )
            // Subtitle
            .fromTo(
                subtitleRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.3'
            )
            // CTA buttons
            .fromTo(
                ctaRef.current.children,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.2'
            )
            // Animation panel
            .fromTo(
                animationRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.3'
            );

    }, { scope: heroRef });

    const titleWords = ['Ditch', 'the', 'Algorithm.', 'Curate', 'Your', 'Feed.'];

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center pt-24 lg:pt-20 pb-16 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50" />

            {/* Animated background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl animate-glow-1" />
                <div className="absolute top-1/3 -right-32 w-80 h-80 lg:w-[500px] lg:h-[500px] bg-gradient-to-bl from-rose-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl animate-glow-2" />
                <div className="absolute -bottom-20 left-1/4 w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-transparent rounded-full blur-3xl animate-glow-3" />
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes glow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
                    50% { transform: translate(20px, -30px) scale(1.2); opacity: 0.7; }
                }
                @keyframes glow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
                    50% { transform: translate(-30px, 25px) scale(1.3); opacity: 0.6; }
                }
                @keyframes glow-3 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
                    50% { transform: translate(15px, -20px) scale(1.15); opacity: 0.7; }
                }
                .animate-glow-1 { animation: glow-1 8s ease-in-out infinite; }
                .animate-glow-2 { animation: glow-2 10s ease-in-out infinite; }
                .animate-glow-3 { animation: glow-3 7s ease-in-out infinite; }
            `}</style>

            {/* Main Content Container */}
            <div className="relative z-10 w-full">
                {/* Text Content - Centered */}
                <div className="container mx-auto max-w-4xl text-center px-4 sm:px-6">

                    {/* Main Title */}
                    <h1
                        ref={titleRef}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral mb-6 leading-[1.1] tracking-tight"
                        style={{ perspective: '1000px' }}
                    >
                        {titleWords.map((word, i) => (
                            <span
                                key={i}
                                className={`hero-title-word inline-block mr-2 sm:mr-3 ${word === 'Algorithm.' ? 'text-base-content/40 line-through decoration-2' : ''} ${word === 'Curate' || word === 'Feed.' ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent' : ''}`}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <p
                        ref={subtitleRef}
                        className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Echo puts you in control. Create custom <span className="font-semibold text-base-content">Scrolls</span> to
                        organize content exactly how you want. No algorithms, no noise — just the Echos that matter to you.
                    </p>

                    {/* CTA Buttons */}
                    <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-neutral via-neutral to-base-800 text-neutral-content rounded-full text-base sm:text-lg font-medium hover:shadow-xl hover:shadow-neutral/20 hover:scale-[1.02] transition-all duration-300"
                        >
                            Get Started Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-base-100 border-2 border-base-300 rounded-full text-base sm:text-lg font-medium hover:border-neutral hover:bg-base-50 transition-all duration-300"
                        >
                            Sign In
                            <Sparkles size={18} className="text-base-content/50 group-hover:text-primary transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Scrolls Animation - Full Width */}
                <div ref={animationRef} className="mt-12 lg:mt-16">
                    <ScrollsAnimation />
                </div>

                {/* Stats Row */}
                <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 mt-12 lg:mt-16 pt-8 border-t border-base-200/80">
                        <Stat value="10K+" label="Users" />
                        <Stat value="50K+" label="Echos" />
                        <Stat value="5K+" label="Scrolls" />
                        <Stat value="100%" label="Your Control" highlight />
                    </div>
                </div>
            </div>
        </section>
    );
};

const Stat = ({ value, label, highlight }) => (
    <div className="text-center">
        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${highlight ? 'bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent' : 'text-neutral'}`}>
            {value}
        </div>
        <div className="text-xs sm:text-sm text-base-content/60">{label}</div>
    </div>
);

export default HeroSection;
