import React, { useState, useRef, useEffect } from 'react';
import { PanelLeft, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

const Navbar = ({ onToggleSidebar }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleSearchIconClick = () => {
        if (isSearchOpen && searchQuery.trim()) {
            handleSearchSubmit();
        } else {
            setIsSearchOpen(true);
        }
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="navbar bg-transparent px-3 relative z-20">
            {/* Mobile: Full-width search bar when open */}
            {isSearchOpen && (
                <div
                    ref={searchContainerRef}
                    className="absolute inset-x-0 top-0 h-full bg-base-100 flex items-center px-3 lg:hidden z-50"
                >
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                        <button
                            type="submit"
                            className="p-2 rounded text-base-content/50 hover:text-base-content transition-colors"
                        >
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search echos, scrolls, users..."
                            className="flex-1 bg-transparent text-base-content placeholder:text-base-content/30 outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleCloseSearch}
                            className="p-2 rounded text-base-content/50 hover:text-base-content transition-colors"
                        >
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </form>
                </div>
            )}

            <div className="navbar-start">
                <button
                    className="lg:hidden p-2 rounded text-base-content/50 hover:text-base-content hover:bg-base-200/50 transition-colors"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <PanelLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            <Link to="/" className="navbar-center">
                <ReactSVG src="/logo.svg" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </Link>

            <div className="navbar-end">
                {/* Desktop: Expandable search */}
                <div
                    ref={searchContainerRef}
                    className="hidden lg:flex items-center"
                    onMouseLeave={() => {
                        if (!searchQuery.trim()) {
                            setIsSearchOpen(false);
                        }
                    }}
                >
                    <div className={`
                        flex items-center overflow-hidden transition-all duration-200 ease-out
                        ${isSearchOpen
                            ? 'w-64 bg-base-200/50 rounded-full'
                            : 'w-9'
                        }
                    `}>
                        {isSearchOpen && (
                            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="flex-1 bg-transparent text-base-content placeholder:text-base-content/30 outline-none text-sm pl-4 py-2"
                                    onBlur={(e) => {
                                        // Don't close if clicking the search button
                                        if (!searchContainerRef.current?.contains(e.relatedTarget)) {
                                            if (!searchQuery.trim()) {
                                                setIsSearchOpen(false);
                                            }
                                        }
                                    }}
                                />
                            </form>
                        )}
                        <button
                            onClick={handleSearchIconClick}
                            onMouseEnter={() => setIsSearchOpen(true)}
                            className={`
                                p-2 rounded-full text-base-content/50 hover:text-base-content transition-colors flex-shrink-0
                                ${isSearchOpen ? '' : 'hover:bg-base-200/50'}
                            `}
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Mobile: Search icon */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="lg:hidden p-2 rounded text-base-content/50 hover:text-base-content hover:bg-base-200/50 transition-colors"
                    aria-label="Search"
                >
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

export default Navbar;