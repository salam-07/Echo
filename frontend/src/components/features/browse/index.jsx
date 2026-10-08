import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useCommunityStore from '../../../store/useCommunityStore';
import ScrollCard from '../scroll/ScrollCard';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../../editorial/Apparatus';

export const TagRow = ({ tag }) => (
    <Link
        to={`/tag/${tag.name}`}
        className="flex min-h-11 items-baseline justify-between gap-4 border-b border-rule py-3 transition-colors hover:bg-paper-shade"
    >
        <span className="text-[0.9375rem] font-medium text-ink break-all">#{tag.name}</span>
        <span className="t-readout shrink-0 text-ink-quiet">{tag.count ?? tag.echoCount ?? 0} {(tag.count ?? tag.echoCount ?? 0) === 1 ? 'Echo' : 'Echos'}</span>
    </Link>
);

export const COMMUNITY_RAIL = [
    { to: '/community', label: 'Explore', end: true },
    { to: '/browse/scrolls', label: 'Feeds' },
    { to: '/browse/curation', label: 'Curations' },
    { to: '/browse/tags', label: 'Tags' },
];

const COPY = {
    feed: {
        label: 'Community feeds',
        subject: 'Community Feeds',
        deck: 'Find a fresh perspective. Follow a Feed to add it to your Scrolls.',
        noun: 'feed',
        empty: 'No public Feeds yet.',
        emptyNote: 'Create a public Feed to share what you like to read.',
    },
    curation: {
        label: 'Community curations',
        subject: 'Community Curations',
        deck: 'Echos worth keeping, picked by people. Follow a collection to come back to it.',
        noun: 'curation',
        empty: 'No public Curations yet.',
        emptyNote: 'Create a public Curation to share your favorite Echos.',
    },
};

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
                subject={copy.subject}
                deck={copy.deck}
            >
                <Rail quiet items={COMMUNITY_RAIL} className="mt-8" />

                <label htmlFor="browse-filter" className="t-label mt-8 block">
                    Search {copy.noun}s
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
                    statement={query.trim() ? `Nothing here matches “${query}”.` : copy.empty}
                    note={query.trim() ? undefined : copy.emptyNote}
                    actions={
                        query.trim() ? (
                            <button type="button" onClick={() => setQuery('')} className="act act-outline h-11 px-6">
                                Clear search
                            </button>
                        ) : (
                            <Link to={`/scroll/new?type=${kind}`} className="act h-11 px-6">
                                Create a {kind === 'feed' ? 'Feed' : 'Curation'}
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="pb-16">
                    {matches.map((scroll) => (
                        <ScrollCard key={scroll._id} scroll={scroll} showKind={false} />
                    ))}
                </div>
            )}
        </Measure>
    );
};
