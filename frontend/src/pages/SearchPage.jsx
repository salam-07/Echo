import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import EchoCard from '../components/features/echo/EchoCard';
import { ScrollCard } from '../components/features/scroll';
import { SearchBar, SEARCH_RAIL, UserRow, searchTo } from '../components/features/search';
import { Measure, SheetHead, Section, Notice, Placeholder, Rail } from '../components/editorial/Apparatus';

/**
 * The contents page of a search: the first five of everything, each division
 * opening onto its own sheet.
 *
 * The old page put results in rounded cards inside a grid and gave users a round
 * plate with an initial in it. Here each division is a ruled register in the same
 * form it takes on its own sheet, so following “See all” changes the length of the
 * list and nothing else about it.
 */
const SearchPage = () => {
    const [params] = useSearchParams();
    const query = params.get('q') || '';

    const { echos, feeds, curations, users, isSearching, searchAll, clearSearch } = useSearchStore();

    useEffect(() => {
        if (query) searchAll(query);
        else clearSearch();
    }, [query, searchAll, clearSearch]);

    const found = echos.length + feeds.length + curations.length + users.length;

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Search"
                    subject={query ? `Everything matching “${query}”.` : 'Look through the whole record.'}
                    readout={query && !isSearching ? `${found} found` : undefined}
                    deck={
                        query
                            ? undefined
                            : 'Echo text, scroll names and descriptions, and the people writing them — one field over all of it.'
                    }
                >
                    <SearchBar autoFocus={!query} />
                    <Rail items={SEARCH_RAIL(query)} className="mt-8" />
                </SheetHead>

                {!query ? (
                    <p className="t-body border-t border-rule py-14 text-ink-quiet">
                        Nothing is being searched yet.
                    </p>
                ) : isSearching && found === 0 ? (
                    <Placeholder rows={3} />
                ) : found === 0 ? (
                    <Notice
                        statement={`Nothing in the record matches “${query}”.`}
                        note="Search reads echo text, scroll names and descriptions, and usernames. One word finds more than a phrase does."
                        actions={
                            <Link to="/browse/tags" className="act act-outline h-11 px-6">
                                Browse by tag instead
                            </Link>
                        }
                    />
                ) : (
                    <div className="pb-16">
                        {echos.length > 0 && (
                            <Section label="Echos" to={searchTo('/search/echos', query)} className="mt-0">
                                {echos.map((echo) => (
                                    <EchoCard key={echo._id} echo={echo} />
                                ))}
                            </Section>
                        )}

                        {users.length > 0 && (
                            <Section label="People" to={searchTo('/search/users', query)}>
                                {users.map((user) => (
                                    <UserRow key={user._id} user={user} />
                                ))}
                            </Section>
                        )}

                        {feeds.length > 0 && (
                            <Section label="Feeds" to={searchTo('/search/scrolls', query, { type: 'feed' })}>
                                {feeds.map((feed) => (
                                    <ScrollCard key={feed._id} scroll={feed} compact />
                                ))}
                            </Section>
                        )}

                        {curations.length > 0 && (
                            <Section
                                label="Curations"
                                to={searchTo('/search/scrolls', query, { type: 'curation' })}
                            >
                                {curations.map((curation) => (
                                    <ScrollCard key={curation._id} scroll={curation} compact />
                                ))}
                            </Section>
                        )}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default SearchPage;
