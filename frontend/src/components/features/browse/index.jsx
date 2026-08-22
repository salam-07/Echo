import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useCommunityStore from '../../../store/useCommunityStore';
import ScrollCard from '../scroll/ScrollCard';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../../editorial/Apparatus';

/**
 * Rows the browse sheets share.
 *
 * A tag and a ranked echo each appear on three or four different sheets, and they
 * were written out longhand on every one of them — so the same tag was a pill here
 * and a table cell there. They are printed once, here.
 */

/** A tag and how many echoes carry it. */
export const TagRow = ({ tag }) => (
    <Link
        to={`/tag/${tag.name}`}
        className="flex min-h-11 items-baseline justify-between gap-4 border-b border-rule py-3 transition-colors hover:bg-paper-shade"
    >
        <span className="text-[0.9375rem] font-medium text-ink">#{tag.name}</span>
        <span className="t-readout shrink-0 text-rule-strong">{tag.count ?? tag.echoCount ?? 0}</span>
    </Link>
);

/**
 * An echo in a ranked list. The numeral is the rank, set in the display face at
 * the width of two digits so the column of text starts at the same place all the
 * way down.
 */
export const RankedEcho = ({ echo, rank }) => (
    <Link to={`/echo/${echo._id}`} className="flex gap-5 border-b border-rule py-5 transition-colors hover:bg-paper-shade">
        {rank != null && (
            <span aria-hidden="true" className="font-display w-8 shrink-0 text-[1.25rem] leading-none text-rule">
                {rank}
            </span>
        )}
        <div className="min-w-0 flex-1">
            <p className="t-readout text-rule-strong">@{echo.author?.userName || 'anonymous'}</p>
            <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-[1.55] text-ink">{echo.content}</p>
            <p className="t-readout mt-2 text-rule-strong">
                {echo.likes || echo.likedBy?.length || 0} likes
            </p>
        </div>
    </Link>
);

/** The rail every community sheet carries, so none of them needs a back-link. */
export const COMMUNITY_RAIL = [
    { to: '/community', label: 'Contents', end: true },
    { to: '/browse/scrolls', label: 'Feeds' },
    { to: '/browse/curation', label: 'Curations' },
    { to: '/browse/tags', label: 'Tags' },
    { to: '/browse/popular', label: 'Most liked' },
];

const COPY = {
    feed: {
        label: 'Community feeds',
        subject: 'Rules other people wrote.',
        deck: 'Follow one and it appears in your index, filling itself by its own terms rather than yours.',
        noun: 'feed',
        empty: 'No public Feeds yet.',
        emptyNote: 'Write one and make it public, and it will be the first on this sheet.',
    },
    curation: {
        label: 'Community curations',
        subject: 'Shelves other people keep.',
        deck: 'Every entry in a Curation was filed by hand, which is a different kind of recommendation.',
        noun: 'curation',
        empty: 'No public Curations yet.',
        emptyNote: 'Start one and make it public, and it will be the first on this sheet.',
    },
};

/**
 * A community register of one kind of Scroll. Feeds and Curations browse the same
 * way, so they browse through the same component and differ only in their nouns.
 */
export const CommunityRegister = ({ kind }) => {
    const copy = COPY[kind];
    const store = useCommunityStore();
    const scrolls = kind === 'feed' ? store.feedScrolls : store.curationScrolls;
    const isLoading = kind === 'feed' ? store.isLoadingFeeds : store.isLoadingCurations;
    const fetch = kind === 'feed' ? store.fetchPublicFeedScrolls : store.fetchPublicCurationScrolls;
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetch();
    }, [fetch]);

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return scrolls;
        return scrolls.filter(
            (scroll) =>
                scroll.name.toLowerCase().includes(term) ||
                scroll.description?.toLowerCase().includes(term) ||
                scroll.creator?.userName?.toLowerCase().includes(term),
        );
    }, [scrolls, query]);

    return (
        <Measure>
            <SheetHead
                label={copy.label}
                subject={copy.subject}
                readout={`${matches.length} ${matches.length === 1 ? copy.noun : `${copy.noun}s`}`}
                deck={copy.deck}
            >
                <Rail items={COMMUNITY_RAIL} className="mt-8" />

                <label htmlFor="browse-filter" className="t-label mt-8 block">
                    Find in this list
                </label>
                <input
                    id="browse-filter"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name, description or author"
                    className="field field-sm mt-1"
                />
            </SheetHead>

            {isLoading && scrolls.length === 0 ? (
                <Placeholder rows={4} />
            ) : matches.length === 0 ? (
                <Notice
                    statement={query ? `Nothing here matches “${query}”.` : copy.empty}
                    note={query ? undefined : copy.emptyNote}
                    actions={
                        query ? (
                            <button type="button" onClick={() => setQuery('')} className="act act-outline h-11 px-6">
                                Clear the filter
                            </button>
                        ) : (
                            <Link to="/scroll/new" className="act h-11 px-6">
                                Make one
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="border-t border-ink pb-16">
                    {matches.map((scroll) => (
                        <ScrollCard key={scroll._id} scroll={scroll} />
                    ))}
                </div>
            )}
        </Measure>
    );
};
