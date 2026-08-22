import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollStore } from '../../../store/useScrollStore';
import useAuthStore from '../../../store/useAuthStore';
import ScrollCard from './ScrollCard';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../../editorial/Apparatus';

/**
 * One register, two sheets. Feeds and Curations differ in what fills them and in
 * nothing else about how they are listed, so they share this and pass their nouns
 * in. Two near-identical 200-line pages was the same sheet printed twice with the
 * captions changed.
 */
export const SCROLL_RAIL = [
    { to: '/scrolls', label: 'All', end: true },
    { to: '/scrolls/feeds', label: 'Feeds' },
    { to: '/scrolls/curations', label: 'Curations' },
];

const COPY = {
    feed: {
        label: 'Feeds',
        subject: 'Rules that fill themselves.',
        deck: 'A Feed reads the terms you set — tags, authors, an order — and gathers whatever satisfies them.',
        action: 'New feed',
        to: '/scroll/new?type=feed',
        empty: 'You have not written a rule yet.',
        emptyNote:
            'Name the tags you want and the ones you do not, and the feed collects entries as they are written.',
        noun: 'feed',
    },
    curation: {
        label: 'Curations',
        subject: 'Shelves you fill by hand.',
        deck: 'A Curation holds only what you file into it, from the Save control on any entry.',
        action: 'New curation',
        to: '/scroll/new?type=curation',
        empty: 'You have not started a Curation yet.',
        emptyNote: 'Start one, then file echoes into it as you come across them.',
        noun: 'curation',
    },
};

const ScrollRegister = ({ kind }) => {
    const copy = COPY[kind];
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
    const { authUser } = useAuthStore();
    const [query, setQuery] = useState('');

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const matches = useMemo(() => {
        const ofKind = scrolls.filter((scroll) => scroll.type === kind);
        const term = query.trim().toLowerCase();
        if (!term) return ofKind;
        return ofKind.filter(
            (scroll) =>
                scroll.name.toLowerCase().includes(term) ||
                scroll.description?.toLowerCase().includes(term),
        );
    }, [scrolls, kind, query]);

    const handleDelete = async (scroll) => {
        if (window.confirm(`Delete "${scroll.name}"? This cannot be undone.`)) {
            await deleteScroll(scroll._id);
        }
    };

    return (
        <Measure>
            <SheetHead
                label={copy.label}
                subject={copy.subject}
                readout={`${matches.length} ${matches.length === 1 ? copy.noun : `${copy.noun}s`}`}
                deck={copy.deck}
                actions={
                    <Link to={copy.to} className="act h-11 px-6">
                        {copy.action}
                    </Link>
                }
            >
                <Rail items={SCROLL_RAIL} className="mt-8" />

                <label htmlFor="register-filter" className="t-label mt-8 block">
                    Find in this list
                </label>
                <input
                    id="register-filter"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name or description"
                    className="field field-sm mt-1"
                />
            </SheetHead>

            {isLoadingScrolls && scrolls.length === 0 ? (
                <Placeholder rows={4} />
            ) : matches.length === 0 ? (
                <Notice
                    statement={query ? `Nothing here matches “${query}”.` : copy.empty}
                    note={query ? undefined : copy.emptyNote}
                    actions={
                        query ? (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="act act-outline h-11 px-6"
                            >
                                Clear the filter
                            </button>
                        ) : (
                            <Link to={copy.to} className="act h-11 px-6">
                                {copy.action}
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="border-t border-ink pb-16">
                    {matches.map((scroll) => (
                        <ScrollCard
                            key={scroll._id}
                            scroll={scroll}
                            action={
                                scroll.creator?._id === authUser?._id ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(scroll)}
                                        disabled={isDeletingScroll}
                                        className="t-label h-9 text-rule-strong transition-colors hover:text-alarm disabled:opacity-40"
                                    >
                                        Delete
                                    </button>
                                ) : null
                            }
                        />
                    ))}
                </div>
            )}
        </Measure>
    );
};

export default ScrollRegister;
