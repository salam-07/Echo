import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import ScrollsAnimation from './ScrollsAnimation';


const line1 = [
    { t: 'Ditch', struck: false },
    { t: 'the', struck: false },
    { t: 'Algorithm.', struck: true },
];
const line2 = ['Curate', 'Your', 'Feed.'];

const HeroSection = () => {
    const heroRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const animationRef = useRef(null);

    useGSAP(() => {
        const targets = ['.hero-title-word', subtitleRef.current, ctaRef.current, animationRef.current];

        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
        }

        gsap.set(animationRef.current, { opacity: 0, y: 24 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(
            '.hero-title-word',
            { y: 64, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.06 }
        )
            .fromTo(
                subtitleRef.current,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.35'
            )
            .fromTo(
                ctaRef.current.children,
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.25'
            )
            .to(animationRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.2');
    }, { scope: heroRef });

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden"
        >
            {/* Monochrome depth — a single soft glow from the top, no colour. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(60% 50% at 50% 0%, var(--color-base-200) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 w-full">
                {/* Text */}
                <div className="container mx-auto max-w-4xl text-center px-6">
                    <h1 className="text-[2.6rem] sm:text-6xl lg:text-7xl text-base-content mb-7 leading-[1.05] tracking-tight">
                        <span className="block font-light">
                            {line1.map((w, i) => (
                                <span
                                    key={i}
                                    className={`hero-title-word inline-block mr-[0.28em] ${
                                        w.struck
                                            ? 'text-base-content/30 line-through decoration-1 decoration-base-content/30'
                                            : ''
                                    }`}
                                >
                                    {w.t}
                                </span>
                            ))}
                        </span>
                        <span className="block font-medium">
                            {line2.map((w, i) => (
                                <span key={i} className="hero-title-word inline-block mr-[0.28em]">
                                    {w}
                                </span>
                            ))}
                        </span>
                    </h1>

                    <p
                        ref={subtitleRef}
                        className="text-base sm:text-lg text-base-content/60 max-w-xl mx-auto mb-9 leading-relaxed"
                    >
                        Build your own <span className="text-base-content font-medium">Scrolls</span> —
                        hand-picked curations or rule-based feeds you define — and see exactly what you
                        choose. No opaque ranking. No noise.
                    </p>

                    <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/signup"
                            className="group flex items-center gap-2 w-full sm:w-auto justify-center px-7 py-3.5 bg-base-content text-base-100 rounded-full text-base font-medium hover:opacity-90 transition-opacity"
                        >
                            Get started free
                            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto text-center px-7 py-3.5 border border-base-300 rounded-full text-base font-medium text-base-content hover:border-base-content/40 hover:bg-base-200/50 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Product preview */}
                <div ref={animationRef} className="mt-16 lg:mt-20">
                    <ScrollsAnimation />
                    <p className="text-center text-sm text-base-content/45 mt-5 px-6">
                        A few Scrolls you could build — yours are entirely up to you.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
