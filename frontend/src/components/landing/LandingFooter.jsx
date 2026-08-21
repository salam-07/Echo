import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const columns = [
    {
        heading: 'Explore',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'The idea', href: '#idea' },
        ],
    },
    {
        heading: 'Account',
        links: [
            { label: 'Log in', to: '/login' },
            { label: 'Get started', to: '/signup' },
        ],
    },
];

const linkClass =
    'text-sm text-base-content/55 hover:text-base-content transition-colors';

const LandingFooter = () => {
    return (
        <footer className="relative py-16 px-6 bg-base-100 border-t border-base-200">
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link
                            to="/"
                            className="text-2xl font-light tracking-tight text-base-content"
                        >
                            echo<span className="text-base-content/30">.</span>
                        </Link>
                        <p className="mt-4 text-sm text-base-content/50 leading-relaxed max-w-[15rem]">
                            Ditch the algorithm. Curate your feed.
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/40 mb-4">
                                {col.heading}
                            </h4>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.to ? (
                                            <Link to={link.to} className={linkClass}>
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a href={link.href} className={linkClass}>
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Project */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/40 mb-4">
                            Project
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://github.com/salam-07/Echo"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${linkClass} inline-flex items-center gap-1.5`}
                                >
                                    <Github size={15} />
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-base-content/45">
                        © {new Date().getFullYear()} Echo
                    </p>
                    <Link
                        to="/signup"
                        className="text-sm px-4 py-2 bg-base-content text-base-100 rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
