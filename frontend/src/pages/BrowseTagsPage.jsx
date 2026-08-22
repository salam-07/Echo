import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../layouts/Layout';
import useCommunityStore from '../store/useCommunityStore';
import { TagRow, COMMUNITY_RAIL } from '../components/features/browse';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../components/editorial/Apparatus';

const ORDERS = [
    { value: 'popular', label: 'Most used' },
    { value: 'alphabetical', label: 'A–Z' },
    { value: 'recent', label: 'Newest' },
];

/**
 * The tag index. Two columns of ruled rows, alphabetised or ranked, with the count
 * in the right margin of each line — an index, which is the form this content has
 * always wanted. The old page set each tag at a size derived from its count, which
 * made a popular tag look like a heading and a rare one look like a footnote.
 */
const BrowseTagsPage = () => {
    const { tags, isLoadingTags, fetchTags } = useCommunityStore();
    const [query, setQuery] = useState('');
    const [order, setOrder] = useState('popular');

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();
        const found = term ? tags.filter((tag) => tag.name.toLowerCase().includes(term)) : [...tags];

        if (order === 'alphabetical') return found.sort((a, b) => a.name.localeCompare(b.name));
        if (order === 'recent') return found.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return found.sort((a, b) => (b.count || 0) - (a.count || 0));
    }, [tags, query, order]);

    return (
        <Layout>
            <Measure wide>
                <SheetHead
                    label="Tags"
                    subject="Every subject anyone has written under."
                    readout={`${matches.length} ${matches.length === 1 ? 'tag' : 'tags'}`}
                    deck="A tag is how a rule finds an echo. Open one to read everything filed under it."
                >
                    <Rail items={COMMUNITY_RAIL} className="mt-8" />

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="tag-filter" className="t-label block">
                                Find a tag
                            </label>
                            <input
                                id="tag-filter"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="poetry"
                                className="field field-sm mt-1"
                            />
                        </div>

                        <fieldset>
                            <legend className="t-label">Order</legend>
                            <div className="mt-1 flex border border-rule">
                                {ORDERS.map((option, index) => (
                                    <label
                                        key={option.value}
                                        data-held={order === option.value || undefined}
                                        className={`stop t-label h-10 flex-1 whitespace-nowrap px-3 ${
                                            index > 0 ? 'border-l border-rule' : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tagOrder"
                                            className="sr-only"
                                            checked={order === option.value}
                                            onChange={() => setOrder(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </SheetHead>

                {isLoadingTags && tags.length === 0 ? (
                    <Placeholder rows={3} />
                ) : matches.length === 0 ? (
                    <Notice
                        statement={query ? `No tag matches “${query}”.` : 'No tags yet.'}
                        note={
                            query
                                ? 'Try a shorter word — tags are single words, lowercased.'
                                : 'Tags appear here as soon as somebody writes an echo carrying one.'
                        }
                        actions={
                            query ? (
                                <button type="button" onClick={() => setQuery('')} className="act act-outline h-11 px-6">
                                    Clear the filter
                                </button>
                            ) : null
                        }
                    />
                ) : (
                    <div className="border-t border-ink pb-16 sm:grid sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3">
                        {matches.map((tag) => (
                            <TagRow key={tag._id} tag={tag} />
                        ))}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default BrowseTagsPage;
