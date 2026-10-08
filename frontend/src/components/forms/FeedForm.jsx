import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';
import { UserAutocomplete } from '../ui';
import { Actions, Clause, Field, Identity, Stops } from './Sheet';

/**
 * Writing a rule. This is the sheet the whole product is an argument for, so it is
 * laid out as a specification a reader can check top to bottom: what the Scroll
 * is, then one clause per term it sets, then the rule itself read back in the
 * document's voice before it is committed.
 *
 * The clauses run in the order a person thinks about a feed — what it takes in,
 * whose writing, from when, and how it is presented — rather than in the order the
 * request happens to send them. Order sits last because it is the one clause with
 * a sensible default, and because it is the first phrase of the sentence printed
 * below it, so the sheet reads continuously into its own summary.
 *
 * The accordions are gone, and so are the clause numbers. A rule you cannot see
 * all of is a rule you cannot check, and four collapsed panels meant the only way
 * to know what your feed would do was to open all four and hold them in your head.
 * Everything is on the sheet, unnumbered, at the length it actually needs.
 *
 * Every either/or is the same control: a rail of hard-edged stops with the held
 * one inverted. Tags are stamps — admitted stamps are set solid, refused stamps
 * are struck through — so include and exclude are told apart by shape, not colour.
 */

const TIME_LABEL = {
    '1day': 'in the last 24 hours',
    '1month': 'in the last month',
    '1year': 'in the last year',
    allTime: 'of all time',
};

/** `a`, `a or b`, `a, b or c` — an English list, so the rule reads as a sentence. */
const englishList = (items, conjunction = 'or') =>
    items.length > 1
        ? `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`
        : items[0];

/**
 * A tag entry line and the stamps it has produced.
 *
 * A pasted `poetry, cities` used to arrive as one tag called `poetrycities`: the
 * separators were stripped out instead of being split on. Pasting a line of tags
 * is the ordinary way to fill this field, so the line is now split and each tag
 * committed on its own.
 */
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
                        return;
                    }
                    setDraft(value);
                }}
                onKeyDown={handleKeyDown}
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
                            {/* One word for one action. The struck tag used to
                                offer "Keep", which asks the reader to parse a
                                double negative — keep it struck? keep it in the
                                feed? — to undo something. Every stamp is taken
                                out of its own list, so every stamp says Remove,
                                and the name says which list. */}
                            <button
                                type="button"
                                onClick={() => onRemove(tag)}
                                aria-label={`Remove #${tag} from the tags this Feed ${
                                    state === 'out' ? 'refuses' : 'admits'
                                }`}
                                className={`stamp-state t-label text-[0.625rem] transition-colors ${
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

    /* Adding and removing are written against the list as it will be rather than
       as it was, because a pasted line of tags commits several tags in one pass
       and each of them would otherwise be appended to the same stale array. */
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

    /* The rule, read back. Assembled from the same state the request is built
       from, so what is printed here cannot drift from what is saved — and its
       verbs are the sheet's own verbs, so the sentence cannot describe a setting
       the reader never made. */
    const clauses = [
        sortBy === 'newestFirst'
            ? 'Newest first'
            : sortBy === 'oldestFirst'
              ? 'Oldest first'
              : `Most liked ${TIME_LABEL[sortTimeRange]}`,
    ];

    if (includedTags.length > 0) {
        const tags = includedTags.map((tag) => `#${tag}`);
        clauses.push(`admitting ${englishList(tags, tagMatchType === 'all' ? 'and' : 'or')}`);
    }
    if (excludedTags.length > 0) {
        clauses.push(`refusing ${englishList(excludedTags.map((tag) => `#${tag}`))}`);
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
                namePlaceholder="Name this rule"
                description={description}
                onDescription={setDescription}
                descriptionPlaceholder="What this feed is for"
                isPrivate={isPrivate}
                onVisibility={setIsPrivate}
            />

            <Clause name="Tags" note="Type a tag and press space.">
                <TagField
                    id="feed-include-tags"
                    label="Admit"
                    placeholder="poetry, notation, cities"
                    tags={includedTags}
                    state="in"
                    onAdd={tagAdder(setIncludedTags)}
                    onRemove={tagRemover(setIncludedTags)}
                />

                {includedTags.length > 1 && (
                    <div className="mt-6">
                        <Stops
                            legend="An Echo must carry"
                            name="tagMatchType"
                            value={tagMatchType}
                            onChange={setTagMatchType}
                            options={[
                                { value: 'any', label: 'Any of them' },
                                { value: 'all', label: 'All of them' },
                            ]}
                        />
                    </div>
                )}

                <div className="mt-8">
                    <TagField
                        id="feed-exclude-tags"
                        label="Refuse"
                        placeholder="tags to keep out"
                        tags={excludedTags}
                        state="out"
                        onAdd={tagAdder(setExcludedTags)}
                        onRemove={tagRemover(setExcludedTags)}
                    />
                </div>
            </Clause>

            <Clause name="Authors" note="Empty admits everyone.">
                <UserAutocomplete
                    label="Admit only"
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

            <Clause name="Echoes you have liked">
                <Stops
                    name="excludeLiked"
                    value={excludeLikedEchos ? 'hide' : 'show'}
                    onChange={(held) => setExcludeLikedEchos(held === 'hide')}
                    options={[
                        { value: 'show', label: 'Show them' },
                        { value: 'hide', label: 'Hide them' },
                    ]}
                />
            </Clause>

            <Clause name="Order">
                <Stops
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

            <section className="mt-14 border-t border-ink pt-6">
                <h2 className="t-label t-label--ink">The rule</h2>
                <p aria-live="polite" className="t-title mt-4 break-words">
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
