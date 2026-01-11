import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="relative py-20 lg:py-32 px-4 bg-gradient-to-br from-neutral via-neutral to-base-900 text-neutral-content overflow-hidden">
            {/* Subtle background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto max-w-4xl">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                        Ready to make your{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                            voice heard
                        </span>
                        ?
                    </h2>
                    <p className="text-lg lg:text-xl text-neutral-content/70 max-w-2xl mx-auto mb-10">
                        Join thousands of creators sharing their ideas on Echo.
                        Start your journey today — it's free.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-rose-500 text-white rounded-full text-lg font-medium hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.02] transition-all duration-300"
                        >
                            Create Your Account
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="group flex items-center gap-2 px-8 py-4 border-2 border-neutral-content/20 rounded-full text-lg font-medium hover:border-neutral-content/40 hover:bg-neutral-content/5 transition-all duration-300"
                        >
                            Sign In
                            <Sparkles size={18} className="text-neutral-content/50 group-hover:text-violet-400 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
