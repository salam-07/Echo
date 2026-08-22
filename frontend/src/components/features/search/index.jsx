import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

/**
 * The search apparatus: the field, the rail between the four result sheets, and
 * the two row types search alone needs.
 *
 * Every sheet carries the field, so a second attempt never costs a trip back to
 * `/search`. The four sheets are otherwise plain enough that a shared register
 * would be three branches wearing one name — the pieces are shared, the pages
 * are not.
 */

/** A search route with the current term carried onto it. */
export const searchTo = (path, query, extra) => {
    const params = new URLSearchParams(extra);
    if (query) params.set('q', query);
    const search = params.toString();
    return search ? `${path}?${search}` : path;
};

export const SEARCH_RAIL = (query) => [
    { to: searchTo('/search', query), label: 'All', end: true },
    { to: searchTo('/search/echos', query), label: 'Echos' },
    { to: searchTo('/search/scrolls', query, { type: 'feed' }), label: 'Scrolls' },
    { to: searchTo('/search/users', query), label: 'Users' },
];

/**
 * The field. Uncontrolled and keyed on the term in the address bar, so it holds no
 * state of its own and still refills correctly when the reader goes back. Submit
 * rewrites `q` and leaves every other parameter — the scroll kind, chiefly — where
 * it was, which is why this one component works on all four sheets.
 */
export const SearchBar = ({ autoFocus = false, className = 'mt-8' }) => {
    const [params, setParams] = useSearchParams();
    const query = params.get('q') || '';

    const handleSubmit = (event) => {
        event.preventDefault();
        const term = new FormData(event.currentTarget).get('q').trim();
        const next = new URLSearchParams(params);
        if (term) next.set('q', term);
        else next.delete('q');
        setParams(next);
    };

    return (
        <form role="search" onSubmit={handleSubmit} className={`flex items-end gap-4 ${className}`}>
            <div className="min-w-0 flex-1">
                <label htmlFor="search-term" className="t-label block">
                    Search the record
                </label>
                <input
                    key={query}
                    id="search-term"
                    name="q"
                    type="search"
                    defaultValue={query}
                    autoFocus={autoFocus}
                    autoComplete="off"
                    placeholder="A word, a name, a tag"
                    className="field field-sm mt-1"
                />
            </div>
            <button type="submit" className="act h-11 shrink-0 px-6">
                Search
            </button>
        </form>
    );
};

/** A person, as a name on a ruled line. The plate belongs to their own masthead. */
export const UserRow = ({ user }) => (
    <Link
        to={`/user/${user._id}`}
        className="flex min-h-11 items-baseline justify-between gap-4 border-b border-rule py-3 transition-colors hover:bg-paper-shade"
    >
        <span className="min-w-0 truncate text-[0.9375rem] font-medium text-ink">@{user.userName}</span>
        <span className="t-label shrink-0 text-rule-strong" aria-hidden="true">
            ↗
        </span>
    </Link>
);
