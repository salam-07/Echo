import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            contentRef.current.children,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="py-20 lg:py-32 px-4 bg-neutral text-neutral-content"
        >
            <div className="container mx-auto max-w-4xl">
                <div ref={contentRef} className="text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                        Ready to make your voice heard?
                    </h2>
                    <p className="text-lg lg:text-xl text-neutral-content/80 max-w-2xl mx-auto mb-10">
                        Join thousands of creators sharing their ideas on Echo.
                        Start your journey today — it's free.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="group flex items-center gap-2 px-8 py-4 bg-base-100 text-neutral rounded-full text-lg font-medium hover:bg-base-200 transition-colors"
                        >
                            Create Your Account
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 border-2 border-neutral-content/30 rounded-full text-lg font-medium hover:border-neutral-content/60 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
