import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { ScrollCard } from '../components/features/scroll';
import { SearchBar, SEARCH_RAIL } from '../components/features/search';
import { Measure, SheetHead, Notice, Placeholder, Coda, More, Rail } from '../components/editorial/Apparatus';

const KINDS = [
    { value: 'feed', label: 'Feeds' },
    { value: 'curation', label: 'Curations' },
];

/**
 * Scrolls whose name or description carries the term.
 *
 * The kind is a parameter of this sheet rather than a stop on the search rail:
 * `NavLink` matches on path alone, so two stops pointing at `/search/scrolls`
 * would both mark themselves held. Here it is a two-stop rail of radios reading
 * and writing `?type=`, which is the same control and only one held position.
 */
const ScrollSearchPage = () => {
    const [params, setParams] = useSearchParams();
    const query = params.get('q') || '';
    const kind = params.get('type') === 'curation' ? 'curation' : 'feed';

    const { feeds, curations, scrollsPagination, isSearching, isLoadingMore, searchScrolls } = useSearchStore();
    const scrolls = kind === 'feed' ? feeds : curations;

    useEffect(() => {
        if (query) searchScrolls(query, kind, 1);
    }, [query, kind, searchScrolls]);

    const setKind = (value) => {
        const next = new URLSearchParams(params);
        next.set('type', value);
        setParams(next);
    };

    const noun = kind === 'feed' ? 'feed' : 'curation';
    const total = scrollsPagination?.total ?? scrolls.length;
    const hasMore = scrollsPagination && scrollsPagination.page < scrollsPagination.totalPages;

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Search · Scrolls"
                    subject={query ? `${kind === 'feed' ? 'Feeds' : 'Curations'} matching “${query}”.` : 'Scrolls.'}
                    readout={query && !isSearching ? `${total} ${total === 1 ? noun : `${noun}s`}` : undefined}
                >
                    <SearchBar autoFocus={!query} />
                    <Rail items={SEARCH_RAIL(query)} className="mt-8" />

                    <fieldset className="mt-5">
                        <legend className="t-label">Kind</legend>
                        <div className="mt-1 flex border border-rule">
                            {KINDS.map((option, index) => (
                                <label
                                    key={option.value}
                                    data-held={kind === option.value || undefined}
                                    className={`stop t-label h-10 flex-1 whitespace-nowrap px-3 ${
                                        index > 0 ? 'border-l border-rule' : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="scrollKind"
                                        className="sr-only"
                                        checked={kind === option.value}
                                        onChange={() => setKind(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </SheetHead>

                {!query ? (
                    <p className="t-body border-t border-rule py-14 text-ink-quiet">
                        Nothing is being searched yet.
                    </p>
                ) : isSearching && scrolls.length === 0 ? (
                    <Placeholder rows={3} />
                ) : scrolls.length === 0 ? (
                    <Notice
                        statement={`No ${noun} matching “${query}”.`}
                        note={`Only public ${noun}s appear here. Try the other kind, or read the community index.`}
                    />
                ) : (
                    <div className="border-t border-ink">
                        {scrolls.map((scroll) => (
                            <ScrollCard key={scroll._id} scroll={scroll} />
                        ))}
                        {hasMore ? (
                            <More
                                shown={scrolls.length}
                                total={total}
                                isLoading={isLoadingMore}
                                onMore={() => searchScrolls(query, kind, scrollsPagination.page + 1)}
                            />
                        ) : (
                            <Coda />
                        )}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default ScrollSearchPage;
