import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import ScrollsAnimation from './ScrollsAnimation';

const HeroSection = () => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const badgeRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);
    const animationRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Badge entrance
        tl.fromTo(
            badgeRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 }
        )
            // Title words animation
            .fromTo(
                '.hero-title-word',
                { y: 80, opacity: 0, rotateX: -45 },
                { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.1 },
                '-=0.3'
            )
            // Subtitle
            .fromTo(
                subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                '-=0.4'
            )
            // Features list
            .fromTo(
                '.hero-feature',
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.3'
            )
            // CTA buttons
            .fromTo(
                ctaRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.2'
            )
            // Animation panel
            .fromTo(
                animationRef.current,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8 },
                '-=0.6'
            );

        // Floating animation for background elements
        gsap.to('.hero-glow', {
            y: -20,
            scale: 1.1,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.5,
        });

    }, { scope: heroRef });

    const titleWords = ['Ditch', 'the', 'Algorithm.', 'Curate', 'Your', 'Feed.'];
    const features = [
        'Create custom Scrolls for topics you love',
        'No algorithm deciding what you see',
        'Curate content your way',
    ];

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center pt-20 lg:pt-0 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50" />

            {/* Animated background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="hero-glow absolute -top-20 -left-20 w-72 h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl" />
                <div className="hero-glow absolute top-1/3 -right-32 w-80 h-80 lg:w-[500px] lg:h-[500px] bg-gradient-to-bl from-rose-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl" />
                <div className="hero-glow absolute -bottom-20 left-1/4 w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl" />
                <div className="hero-glow absolute bottom-1/3 right-1/3 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-tl from-amber-500/8 via-orange-500/8 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Main Content Container */}
            <div ref={contentRef} className="mt-30 relative z-10 container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Left Column - Text Content */}
                    <div className="text-left order-2 lg:order-1">

                        {/* Main Title */}
                        <h1
                            ref={titleRef}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-neutral mb-6 leading-[1.1] tracking-tight"
                            style={{ perspective: '1000px' }}
                        >
                            {titleWords.map((word, i) => (
                                <span
                                    key={i}
                                    className={`hero-title-word inline-block mr-2 sm:mr-3 ${word === 'Algorithm.' ? 'text-base-content/40 line-through decoration-2' : ''
                                        } ${word === 'Curate' || word === 'Feed.' ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent' : ''
                                        }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </h1>

                        {/* Subtitle */}
                        <p
                            ref={subtitleRef}
                            className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-lg mb-8 leading-relaxed"
                        >
                            Echo puts you in control. Create custom <span className="font-semibold text-base-content">Scrolls</span> to
                            organize content exactly how you want. No algorithms, no noise — just the Echos that matter to you.
                        </p>

                        {/* Features List */}
                        <div ref={featuresRef} className="space-y-3 mb-8">
                            {features.map((feature, i) => (
                                <div key={i} className="hero-feature flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <Check size={12} className="text-white" strokeWidth={3} />
                                    </div>
                                    <span className="text-base-content/80 text-sm sm:text-base">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-4">
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

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 lg:gap-10 mt-10 lg:mt-12 pt-8 border-t border-base-200/80">
                            <Stat value="10K+" label="Users" />
                            <Stat value="50K+" label="Echos" />
                            <Stat value="5K+" label="Scrolls" />
                            <Stat value="100%" label="Your Control" highlight />
                        </div>
                    </div>

                    {/* Right Column - Animation */}
                    <div
                        ref={animationRef}
                        className="relative order-1 lg:order-2 min-h-[380px] sm:min-h-[420px] lg:min-h-[500px] flex items-center"
                    >
                        <ScrollsAnimation />
                    </div>
                </div>
            </div>
        </section>
    );
};

const Stat = ({ value, label, highlight }) => (
    <div className="text-left">
        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${highlight ? 'bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent' : 'text-neutral'}`}>
            {value}
        </div>
        <div className="text-xs sm:text-sm text-base-content/60">{label}</div>
    </div>
);

export default HeroSection;
