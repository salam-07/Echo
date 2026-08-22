import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import EchoCard from '../components/features/echo/EchoCard';
import { SearchBar, SEARCH_RAIL } from '../components/features/search';
import { Measure, SheetHead, Notice, Placeholder, Coda, More, Rail } from '../components/editorial/Apparatus';

/** Every echo whose text carries the term. */
const EchoSearchPage = () => {
    const [params] = useSearchParams();
    const query = params.get('q') || '';

    const { echos, echosPagination, isSearching, isLoadingMore, searchEchos } = useSearchStore();

    useEffect(() => {
        if (query) searchEchos(query, 1);
    }, [query, searchEchos]);

    const total = echosPagination?.total ?? echos.length;
    const hasMore = echosPagination && echosPagination.page < echosPagination.totalPages;

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Search · Echos"
                    subject={query ? `Echos matching “${query}”.` : 'Echos.'}
                    readout={query && !isSearching ? `${total} ${total === 1 ? 'entry' : 'entries'}` : undefined}
                >
                    <SearchBar autoFocus={!query} />
                    <Rail items={SEARCH_RAIL(query)} className="mt-8" />
                </SheetHead>

                {!query ? (
                    <p className="t-body border-t border-rule py-14 text-ink-quiet">
                        Nothing is being searched yet.
                    </p>
                ) : isSearching && echos.length === 0 ? (
                    <Placeholder rows={4} />
                ) : echos.length === 0 ? (
                    <Notice
                        statement={`No echo carries “${query}”.`}
                        note="Search matches the words in an echo, not the tags filed against it. Try a single word, or look for the tag itself."
                    />
                ) : (
                    <div className="border-t border-ink">
                        {echos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                        {hasMore ? (
                            <More
                                shown={echos.length}
                                total={total}
                                isLoading={isLoadingMore}
                                onMore={() => searchEchos(query, echosPagination.page + 1)}
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

export default EchoSearchPage;
