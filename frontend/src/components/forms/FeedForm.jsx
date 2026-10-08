import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';
import { UserAutocomplete } from '../ui';
import { Actions, Clause, Field, Identity, Stops } from './Sheet';

const TIME_LABEL = {
    '1day': 'in the last 24 hours',
    '1month': 'in the last month',
    '1year': 'in the last year',
    allTime: 'of all time',
};

const englishList = (items, conjunction = 'or') =>
    items.length > 1
        ? `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`
        : items[0];

const TagField = ({ id, label, placeholder, tags, onAdd, onRemove, state }) => {
    const [draft, setDraft] = useState('');

    const commit = (raw) => {
        raw.split(/[,\s]+/)
            .map((tag) => tag.replace(/^#/, '').trim().toLowerCase())
            .filter(Boolean)
            .forEach(onAdd);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            event.preventDefault();
            commit(draft);
            setDraft('');
        } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
            onRemove(tags[tags.length - 1]);
        }
    };

    return (
        <div>
            <Field
                id={id}
                label={label}
                value={draft}
                onChange={(value) => {
                    if (/[,\s]/.test(value)) {
                        commit(value);
                        setDraft('');
                        return;
                    }
                    setDraft(value);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => { commit(draft); setDraft(''); }}
                placeholder={placeholder}
                autoComplete="off"
            />

            {tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <li key={tag} data-state={state} className="stamp max-w-full px-3 py-1.5">
                            <span className="min-w-0 break-all text-[0.8125rem] leading-[1.4]">
                                #{tag}
                            </span>
                            <button
                                type="button"
                                onClick={() => onRemove(tag)}
                                aria-label={`Remove #${tag} from the tags this Feed ${
                                    state === 'out' ? 'excludes' : 'includes'
                                }`}
                                className={`stamp-state t-label min-h-8 text-[0.625rem] transition-colors ${
                                    state === 'out'
                                        ? 'text-ink-quiet hover:text-ink'
                                        : 'text-chalk-quiet hover:text-chalk'
                                }`}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FeedForm = ({ autoFocus = false }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const [tagMatchType, setTagMatchType] = useState('any');
    const [includedTags, setIncludedTags] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);

    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const [useDateRange, setUseDateRange] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [sortBy, setSortBy] = useState('newestFirst');
    const [sortTimeRange, setSortTimeRange] = useState('allTime');
    const [excludeLikedEchos, setExcludeLikedEchos] = useState(false);

    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    const tagAdder = (setter) => (tag) =>
        setter((tags) => (tags.includes(tag) ? tags : [...tags, tag]));
    const tagRemover = (setter) => (tag) => setter((tags) => tags.filter((item) => item !== tag));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim() || isCreatingScroll) return;

        const feedConfig = {
            tagMatchType: includedTags.length > 0 ? tagMatchType : 'any',
            includedTags,
            excludedTags,
            authors: selectedAuthors.map((author) => author._id),
            sortBy,
            sortTimeRange,
            excludeLikedEchos,
        };

        if (useDateRange) {
            feedConfig.dateRange = {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            };
        }

        try {
            await createScroll({
                name: name.trim(),
                description: description.trim(),
                type: 'feed',
                feedConfig,
                isPrivate,
            });
            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating feed:', error);
        }
    };

    const clauses = [
        sortBy === 'newestFirst'
            ? 'Newest first'
            : sortBy === 'oldestFirst'
              ? 'Oldest first'
              : `Most liked ${TIME_LABEL[sortTimeRange]}`,
    ];

    if (includedTags.length > 0) {
        const tags = includedTags.map((tag) => `#${tag}`);
        clauses.push(`with ${englishList(tags, tagMatchType === 'all' ? 'and' : 'or')}`);
    }
    if (excludedTags.length > 0) {
        clauses.push(`without ${englishList(excludedTags.map((tag) => `#${tag}`))}`);
    }
    clauses.push(
        selectedAuthors.length > 0
            ? `by ${englishList(selectedAuthors.map((author) => `@${author.userName}`))}`
            : 'from anyone',
    );
    if (useDateRange && (startDate || endDate)) {
        if (startDate && endDate) clauses.push(`written between ${startDate} and ${endDate}`);
        else if (startDate) clauses.push(`written since ${startDate}`);
        else clauses.push(`written up to ${endDate}`);
    }
    if (excludeLikedEchos) clauses.push('skipping anything you have already liked');

    return (
        <form onSubmit={handleSubmit}>
            <Identity
                kind="Feed"
                autoFocus={autoFocus}
                name={name}
                onName={setName}
                namePlaceholder="e.g. Creative hours"
                description={description}
                onDescription={setDescription}
                descriptionPlaceholder="What would you like to read?"
                isPrivate={isPrivate}
                onVisibility={setIsPrivate}
            />

            <div className="mt-8">
                <TagField
                    id="feed-include-tags"
                    label="Include tags (optional)"
                    placeholder="poetry, notation, cities"
                    tags={includedTags}
                    state="in"
                    onAdd={tagAdder(setIncludedTags)}
                    onRemove={tagRemover(setIncludedTags)}
                />

                {includedTags.length > 1 && (
                    <div className="mt-6">
                        <Stops
                            legend="Match"
                            name="tagMatchType"
                            value={tagMatchType}
                            onChange={setTagMatchType}
                            options={[
                                { value: 'any', label: 'Any tag' },
                                { value: 'all', label: 'All tags' },
                            ]}
                        />
                    </div>
                )}

                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-quiet">Separate tags with a space or comma. Leave empty for all topics.</p>
            </div>

            <Clause name="Order">
                <Stops
                    srLegend="Sort order"
                    name="sortBy"
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                        { value: 'newestFirst', label: 'Newest' },
                        { value: 'oldestFirst', label: 'Oldest' },
                        { value: 'mostLiked', label: 'Most liked' },
                    ]}
                />

                {sortBy === 'mostLiked' && (
                    <div className="mt-6">
                        <Stops
                            legend="Measured over"
                            name="sortTimeRange"
                            value={sortTimeRange}
                            onChange={setSortTimeRange}
                            options={[
                                { value: '1day', label: '24 hours' },
                                { value: '1month', label: 'Month' },
                                { value: '1year', label: 'Year' },
                                { value: 'allTime', label: 'All time' },
                            ]}
                        />
                    </div>
                )}
            </Clause>

            <details className="mt-8">
                <summary className="t-label t-label--ink cursor-pointer py-3 focus-visible:outline-2 focus-visible:outline-offset-4">
                    More filters · authors, dates & exclusions
                </summary>
                <div className="mt-8">
                    <TagField
                        id="feed-exclude-tags"
                        label="Exclude tags"
                        placeholder="tags to keep out"
                        tags={excludedTags}
                        state="out"
                        onAdd={tagAdder(setExcludedTags)}
                        onRemove={tagRemover(setExcludedTags)}
                    />
                </div>
                <Clause name="Authors" note="Leave empty to include everyone.">
                    <UserAutocomplete
                        label="Only from"
                        selectedUsers={selectedAuthors}
                        onUserAdd={(user) => setSelectedAuthors((authors) => [...authors, user])}
                        onUserRemove={(userId) =>
                            setSelectedAuthors((authors) =>
                                authors.filter((author) => author._id !== userId),
                            )
                        }
                        placeholder="Search by username"
                    />
                </Clause>

                <Clause name="Dates">
                    <Stops
                        srLegend="Date range"
                        name="window"
                        value={useDateRange ? 'between' : 'any'}
                        onChange={(held) => setUseDateRange(held === 'between')}
                        options={[
                            { value: 'any', label: 'Any time' },
                            { value: 'between', label: 'Between dates' },
                        ]}
                    />

                    {useDateRange && (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <Field
                                id="feed-start"
                                label="From"
                                type="date"
                                value={startDate}
                                onChange={setStartDate}
                            />
                            <Field
                                id="feed-end"
                                label="To"
                                type="date"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
                    )}
                </Clause>

                <Clause name="Echos you have liked">
                    <Stops
                        srLegend="Previously liked Echos"
                        name="excludeLiked"
                        value={excludeLikedEchos ? 'hide' : 'show'}
                        onChange={(held) => setExcludeLikedEchos(held === 'hide')}
                        options={[
                            { value: 'show', label: 'Show them' },
                            { value: 'hide', label: 'Hide them' },
                        ]}
                    />
                </Clause>

            </details>

            <section className="mt-8 border-t border-rule pt-5">
                <h2 className="t-label t-label--ink">Your Feed</h2>
                <p aria-live="polite" className="mt-3 break-words text-[0.9375rem] leading-relaxed text-ink-soft">
                    {clauses.join(', ')}.
                </p>
            </section>

            <Actions
                label="Create Feed"
                busyLabel="Creating…"
                canSubmit={name.trim().length > 0}
                isBusy={isCreatingScroll}
                onCancel={() => navigate(-1)}
            />
        </form>
    );
};

export default FeedForm;
