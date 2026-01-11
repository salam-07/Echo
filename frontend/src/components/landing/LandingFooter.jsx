import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Community', href: '#testimonials' },
    ],
    company: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
};

const LandingFooter = () => {
    return (
        <footer className="relative py-16 px-4 bg-base-100 border-t border-base-200 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-violet-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
                            Echo
                        </Link>
                        <p className="mt-4 text-base-content/60 text-sm">
                            Your platform for sharing ideas that resonate.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-neutral mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map(link => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-base-content/60 hover:text-base-content transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-neutral mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map(link => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-base-content/60 hover:text-base-content transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-neutral mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map(link => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-base-content/60 hover:text-base-content transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-base-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-base-content/60 text-sm">
                        © {new Date().getFullYear()} Echo. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/login"
                            className="text-sm text-base-content/60 hover:text-base-content transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm px-4 py-2 bg-gradient-to-r from-violet-500 to-rose-500 text-white rounded-full hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
