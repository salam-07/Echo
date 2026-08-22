import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { SearchBar, SEARCH_RAIL, UserRow } from '../components/features/search';
import { Measure, SheetHead, Notice, Placeholder, Coda, Rail } from '../components/editorial/Apparatus';

/**
 * People whose name carries the term. An index of names, two columns wide — the
 * old page gave each one a round plate and a card, which is a lot of furniture
 * around a single word.
 */
const UserSearchPage = () => {
    const [params] = useSearchParams();
    const query = params.get('q') || '';

    const { users, isSearching, searchUsers } = useSearchStore();

    useEffect(() => {
        if (query) searchUsers(query);
    }, [query, searchUsers]);

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Search · People"
                    subject={query ? `People matching “${query}”.` : 'People.'}
                    readout={
                        query && !isSearching ? `${users.length} ${users.length === 1 ? 'name' : 'names'}` : undefined
                    }
                >
                    <SearchBar autoFocus={!query} />
                    <Rail items={SEARCH_RAIL(query)} className="mt-8" />
                </SheetHead>

                {!query ? (
                    <p className="t-body border-t border-rule py-14 text-ink-quiet">
                        Nothing is being searched yet.
                    </p>
                ) : isSearching && users.length === 0 ? (
                    <Placeholder rows={2} />
                ) : users.length === 0 ? (
                    <Notice
                        statement={`Nobody here is called “${query}”.`}
                        note="Names are matched as written, without the @. Part of a name is enough."
                    />
                ) : (
                    <div className="border-t border-ink sm:grid sm:grid-cols-2 sm:gap-x-12">
                        {users.map((user) => (
                            <UserRow key={user._id} user={user} />
                        ))}
                        <div className="sm:col-span-2">
                            <Coda />
                        </div>
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default UserSearchPage;
