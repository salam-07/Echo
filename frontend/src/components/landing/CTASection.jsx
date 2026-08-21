import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const CTASection = () => {
    return (
        <section className="relative py-24 sm:py-28 lg:py-36 px-6 bg-neutral text-neutral-content overflow-hidden">
            {/* Subtle monochrome depth, from the foreground colour. */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                    background:
                        'radial-gradient(50% 60% at 50% 0%, var(--color-neutral-content) 0%, transparent 70%)',
                }}
            />

            <Reveal className="relative container mx-auto max-w-3xl text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] mb-6">
                    Build a feed that's{' '}
                    <span className="font-medium">finally yours.</span>
                </h2>
                <p className="text-base sm:text-lg text-neutral-content/70 max-w-xl mx-auto mb-10 leading-relaxed">
                    Create an account and build your first Scroll in a minute — just a username and a
                    password. No email required.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/signup"
                        className="group flex items-center gap-2 w-full sm:w-auto justify-center px-7 py-3.5 bg-neutral-content text-neutral rounded-full text-base font-medium hover:opacity-90 transition-opacity"
                    >
                        Create your account
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto text-center px-7 py-3.5 border border-neutral-content/25 rounded-full text-base font-medium hover:border-neutral-content/50 hover:bg-neutral-content/5 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </Reveal>
        </section>
    );
};

export default CTASection;
