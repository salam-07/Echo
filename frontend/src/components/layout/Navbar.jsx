import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * The running head. It sits above every sheet in the document and carries three
 * things: whose document this is, which sheet you are on, and the one control
 * that reaches any sheet at all.
 *
 * The address is derived here rather than passed in, because twenty screens
 * passing their own §-number is twenty chances for the index column and the
 * running head to disagree about where you are.
 */

const ADDRESS = [
    ['/settings', '§05', 'Settings'],
    ['/profile', '§05', 'Account'],
    ['/user/', '§05', 'Account'],
    ['/search', '§04', 'Search'],
    ['/browse', '§03', 'Community'],
    ['/community', '§03', 'Community'],
    ['/tag/', '§03', 'Tags'],
    ['/scrolls', '§02', 'Scrolls'],
    ['/scroll/new', '§02', 'New scroll'],
    ['/scroll/', '§02', 'Scrolls'],
    ['/new', '§01', 'New echo'],
    ['/echo/', '§01', 'Echo'],
];

export const addressFor = (pathname) => {
    const match = ADDRESS.find(([prefix]) => pathname.startsWith(prefix));
    return match ? { reference: match[1], name: match[2] } : { reference: '§01', name: 'Feed' };
};

const Navbar = ({ onToggleSidebar }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const { reference, name } = addressFor(pathname);

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setQuery('');
    };

    return (
        <header className="sticky top-0 z-30 h-14 border-b border-rule bg-paper">
            <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-4 lg:px-6">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="t-label -ml-2 flex h-11 items-center px-2 transition-colors hover:text-ink lg:hidden"
                >
                    Index
                </button>

                <Link
                    to="/"
                    className="font-display text-[1.25rem] leading-none tracking-[-0.01em] text-ink"
                >
                    Echo
                </Link>

                <p className="t-label hidden shrink-0 items-baseline gap-2 sm:flex">
                    <span className="text-rule-strong">{reference}</span>
                    <span className="t-label--ink">{name}</span>
                </p>

                <div className="flex flex-1 justify-end">
                    <form onSubmit={handleSubmit} className="hidden w-full max-w-[18rem] md:block">
                        <label htmlFor="running-search" className="sr-only">
                            Search Echos, Scrolls, users, and tags
                        </label>
                        <input
                            id="running-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search"
                            className="field field-sm"
                        />
                    </form>

                    <Link to="/search" className="t-label flex h-11 items-center px-2 md:hidden">
                        Search
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
