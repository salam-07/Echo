import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const decorRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Animate title characters
        tl.fromTo(
            titleRef.current.children,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.05 }
        )
            .fromTo(
                subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.4'
            )
            .fromTo(
                ctaRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
                '-=0.3'
            )
            .fromTo(
                decorRef.current.children,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1 },
                '-=0.5'
            );

        // Floating animation for decorative elements
        gsap.to('.hero-float', {
            y: -15,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.3,
        });
    }, { scope: heroRef });

    const titleText = "Your Platform";

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 via-base-100 to-base-100" />

            {/* Decorative elements */}
            <div ref={decorRef} className="absolute inset-0 pointer-events-none">
                <div className="hero-float absolute top-[20%] left-[10%] w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
                <div className="hero-float absolute top-[30%] right-[15%] w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl" />
                <div className="hero-float absolute bottom-[25%] left-[20%] w-24 h-24 lg:w-40 lg:h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl" />
                <div className="hero-float absolute bottom-[20%] right-[10%] w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-xl" />
            </div>

            <div className="relative z-10 container mx-auto text-center max-w-5xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-base-200 rounded-full text-sm">
                    <Sparkles size={16} className="text-primary" />
                    <span>Share your thoughts with the world</span>
                </div>

                {/* Main Title */}
                <h1
                    ref={titleRef}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-neutral mb-6 leading-tight overflow-hidden"
                >
                    {titleText.split('').map((char, i) => (
                        <span key={i} className="inline-block">
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-lg sm:text-xl lg:text-2xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Echo is where ideas resonate. Share your thoughts, curate collections,
                    and discover content that matters through Echos and Scrolls.
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="group flex items-center gap-2 px-8 py-4 bg-neutral text-neutral-content rounded-full text-lg font-medium hover:opacity-90 transition-all"
                    >
                        Start for Free
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 border-2 border-base-300 rounded-full text-lg font-medium hover:border-neutral transition-colors"
                    >
                        Log In
                    </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 mt-16 pt-8 border-t border-base-200">
                    <Stat value="10K+" label="Active Users" />
                    <Stat value="50K+" label="Echos Shared" />
                    <Stat value="5K+" label="Scrolls Created" />
                </div>
            </div>
        </section>
    );
};

const Stat = ({ value, label }) => (
    <div className="text-center">
        <div className="text-2xl lg:text-3xl font-bold text-neutral">{value}</div>
        <div className="text-sm text-base-content/60">{label}</div>
    </div>
);

export default HeroSection;
