import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#idea', label: 'The idea' },
];

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 24);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
                isScrolled
                    ? 'bg-base-100/80 backdrop-blur-md border-b border-base-200/70'
                    : 'bg-transparent border-b border-transparent'
            )}
        >
            <div className="container mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Wordmark */}
                    <Link
                        to="/"
                        className="text-2xl lg:text-[1.7rem] font-light tracking-tight text-base-content"
                    >
                        echo<span className="text-base-content/30">.</span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-base-content/60 hover:text-base-content transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop auth */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 text-sm font-medium bg-base-content text-base-100 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get started
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 -mr-2 text-base-content"
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-base-100 border-t border-base-200 shadow-sm">
                        <div className="flex flex-col p-6 gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-base-content/70 hover:text-base-content py-2.5 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex flex-col gap-3 pt-5 mt-3 border-t border-base-200">
                                <Link
                                    to="/login"
                                    className="text-center py-2.5 text-sm border border-base-300 rounded-full hover:border-base-content/40 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-center py-2.5 text-sm font-medium bg-base-content text-base-100 rounded-full hover:opacity-90 transition-opacity"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default LandingNavbar;
