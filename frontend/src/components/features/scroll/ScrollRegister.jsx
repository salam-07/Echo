import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollStore } from '../../../store/useScrollStore';
import useAuthStore from '../../../store/useAuthStore';
import ScrollGroup from './ScrollGroup';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../../editorial/Apparatus';

export const SCROLL_RAIL = [
    { to: '/scrolls', label: 'All', end: true },
    { to: '/scrolls/feeds', label: 'Feeds' },
    { to: '/scrolls/curations', label: 'Curations' },
];

const COPY = {
    feed: {
        label: 'Feeds',
        subject: 'Your Feeds',
        deck: 'Echos gathered automatically around your interests.',
        action: 'Create a Feed',
        to: '/scroll/new?type=feed',
        empty: 'No Feeds yet.',
        emptyNote:
            'Choose topics and people to build a Feed, or follow one from Community.',
        noun: 'feed',
    },
    curation: {
        label: 'Curations',
        subject: 'Your Curations',
        deck: 'Collections you create or follow. Good Echos, kept close.',
        action: 'Create a Curation',
        to: '/scroll/new?type=curation',
        empty: 'Start a collection worth returning to.',
        emptyNote: 'Create a Curation, then use Save on any Echo to add it.',
        noun: 'curation',
    },
};

const ScrollRegister = ({ kind }) => {
    const copy = COPY[kind];
    const { scrolls, isLoadingScrolls, scrollsError, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
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

    const { owned, followed } = useMemo(
        () => ({
            owned: matches.filter((scroll) => scroll.creator?._id === authUser?._id),
            followed: matches.filter((scroll) => scroll.creator?._id !== authUser?._id),
        }),
        [matches, authUser?._id],
    );

    const handleDelete = async (scroll) => {
        if (window.confirm(`Delete "${scroll.name}"? This cannot be undone.`)) {
            await deleteScroll(scroll._id);
        }
    };

    const deleteAction = (scroll) => (
        <button
            type="button"
            onClick={() => handleDelete(scroll)}
            disabled={isDeletingScroll}
            className="t-label min-h-11 text-ink-quiet transition-colors hover:text-alarm disabled:opacity-40"
        >
            Delete
        </button>
    );

    return (
        <Measure>
            <SheetHead
                subject={copy.subject}
                deck={copy.deck}
                actions={scrolls.length > 0 && (
                    <Link to={copy.to} className="act h-11 px-6">
                        {copy.action}
                    </Link>
                )}
            >
                <Rail quiet items={SCROLL_RAIL} className="mt-8" />

                <label htmlFor="register-filter" className="t-label mt-8 block">
                    Search {copy.label.toLowerCase()}
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

            {scrollsError && scrolls.length === 0 ? (
                <Notice statement="Couldn’t load your Scrolls." note="Try again to bring your library back."
                    actions={<button type="button" onClick={() => getScrolls()} className="act h-11 px-6">Try again</button>} />
            ) : isLoadingScrolls && scrolls.length === 0 ? (
                <Placeholder rows={4} />
            ) : matches.length === 0 ? (
                <Notice
                    statement={query.trim() ? `Nothing here matches “${query}”.` : copy.empty}
                    note={query.trim() ? undefined : copy.emptyNote}
                    actions={
                        query.trim() ? (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="act act-outline h-11 px-6"
                            >
                                Clear search
                            </button>
                        ) : (
                            <Link to={copy.to} className="act h-11 px-6">
                                {copy.action}
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="pb-16">
                    <ScrollGroup
                        label="Yours"
                        count={owned.length}
                        items={owned}
                        showKind={false}
                        renderAction={deleteAction}
                    />
                    <ScrollGroup
                        label="Following"
                        count={followed.length}
                        items={followed}
                        showKind={false}
                    />
                </div>
            )}
        </Measure>
    );
};

export default ScrollRegister;
