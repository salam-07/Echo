import React, { useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { useNavigate } from 'react-router-dom';
import { UserAutocomplete } from '../ui';

/**
 * Writing a rule. This is the sheet the whole product is an argument for, so it is
 * laid out as a specification: numbered clauses, every one of them open.
 *
 * The accordions are gone. A rule you cannot see all of is a rule you cannot check,
 * and four collapsed panels meant the only way to know what your feed would do was
 * to open all four and hold them in your head. Instead, everything is on the sheet
 * and the last clause prints the rule back to you as a sentence — the reader's own
 * words, in the document's voice, before they commit it.
 *
 * Every either/or is the same control: a rail of hard-edged stops with the held one
 * inverted. Tags are stamps — admitted stamps are inverted, refused stamps are
 * struck through — so include and exclude are told apart by shape, not by colour.
 */

const TIME_LABEL = {
    '1day': 'in the last 24 hours',
    '1month': 'in the last month',
    '1year': 'in the last year',
    allTime: 'of all time',
};

/** A numbered clause of the specification. */
const Clause = ({ reference, name, note, children }) => (
    <section className="mt-10 border-t border-rule pt-5">
        <div className="flex items-baseline gap-3">
            <span className="t-label text-rule-strong">{reference}</span>
            <h2 className="t-label t-label--ink">{name}</h2>
        </div>
        {note && <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">{note}</p>}
        <div className="mt-5">{children}</div>
    </section>
);

/** A rail of stops. One held, always; the held one is inverted and at weight 600. */
const Rail = ({ legend, options, value, onChange, name }) => (
    <fieldset>
        {legend && <legend className="t-label mb-2">{legend}</legend>}
        <div className="flex flex-wrap border border-rule">
            {options.map((option, index) => (
                <label
                    key={option.value}
                    data-held={value === option.value || undefined}
                    className={`stop t-label h-11 flex-1 whitespace-nowrap px-4 ${
                        index > 0 ? 'border-l border-rule' : ''
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        className="sr-only"
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    </fieldset>
);

/** A tag entry line and the stamps it has produced. */
const TagField = ({ id, label, placeholder, tags, onAdd, onRemove, state }) => {
    const [draft, setDraft] = useState('');

    const commit = (raw) => {
        const clean = raw.replace(/^#/, '').replace(/[, ]+/g, '').trim().toLowerCase();
        if (clean && !tags.includes(clean)) onAdd(clean);
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
            <label htmlFor={id} className="t-label block">
                {label}
            </label>
            <input
                id={id}
                type="text"
                value={draft}
                onChange={(event) => {
                    const value = event.target.value;
                    if (value.includes(' ') || value.includes(',')) {
                        commit(value);
                        setDraft('');
                        return;
                    }
                    setDraft(value);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="field field-sm mt-1"
                autoComplete="off"
            />
            {tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <li key={tag} data-state={state} className="stamp px-3 py-1.5">
                            <span className="text-[0.8125rem] leading-[1.4]">#{tag}</span>
                            <button
                                type="button"
                                onClick={() => onRemove(tag)}
                                aria-label={`Remove #${tag}`}
                                className="stamp-state t-label text-[0.625rem] opacity-70 transition-opacity hover:opacity-100"
                            >
                                {state === 'out' ? 'Keep' : 'Remove'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FeedForm = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) return;

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

    const canSubmit = name.trim().length > 0 && !isCreatingScroll;

    /* The rule, read back. Assembled from the same state the request is built
       from, so what is printed here cannot drift from what is saved. */
    const clauses = [
        sortBy === 'newestFirst'
            ? 'Newest first'
            : sortBy === 'oldestFirst'
              ? 'Oldest first'
              : `Most liked ${TIME_LABEL[sortTimeRange]}`,
    ];

    if (includedTags.length > 0) {
        clauses.push(
            `tagged ${includedTags.map((tag) => `#${tag}`).join(tagMatchType === 'all' ? ' and ' : ' or ')}`,
        );
    }
    if (excludedTags.length > 0) {
        clauses.push(`never ${excludedTags.map((tag) => `#${tag}`).join(' or ')}`);
    }
    if (selectedAuthors.length > 0) {
        clauses.push(`by ${selectedAuthors.map((author) => `@${author.userName}`).join(', ')}`);
    } else {
        clauses.push('from anyone');
    }
    if (useDateRange && (startDate || endDate)) {
        if (startDate && endDate) clauses.push(`written between ${startDate} and ${endDate}`);
        else if (startDate) clauses.push(`written after ${startDate}`);
        else clauses.push(`written before ${endDate}`);
    }
    if (excludeLikedEchos) clauses.push('nothing you have already liked');

    return (
        <form onSubmit={handleSubmit}>
            <Clause reference="§1" name="Name">
                <div>
                    <label htmlFor="feed-name" className="sr-only">
                        Feed name
                    </label>
                    <input
                        id="feed-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name this rule"
                        className="field"
                        maxLength={50}
                        autoFocus
                    />
                    <p className="t-readout mt-2 text-right text-rule-strong">{name.length}/50</p>
                </div>

                <div className="mt-6">
                    <label htmlFor="feed-description" className="t-label block">
                        Description <span className="font-normal normal-case tracking-normal">— optional</span>
                    </label>
                    <textarea
                        id="feed-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="What this feed is for"
                        className="field field-sm mt-1 resize-none"
                        rows={2}
                        maxLength={200}
                    />
                    <p className="t-readout mt-2 text-right text-rule-strong">{description.length}/200</p>
                </div>
            </Clause>

            <Clause
                reference="§2"
                name="Tags"
                note="Type a tag and press space. Admitted tags are set solid; refused tags are struck."
            >
                <TagField
                    id="feed-include-tags"
                    label="Admit"
                    placeholder="poetry, notation, cities"
                    tags={includedTags}
                    state="in"
                    onAdd={(tag) => setIncludedTags([...includedTags, tag])}
                    onRemove={(tag) => setIncludedTags(includedTags.filter((t) => t !== tag))}
                />

                {includedTags.length > 1 && (
                    <div className="mt-6">
                        <Rail
                            legend="An entry must carry"
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
                        onAdd={(tag) => setExcludedTags([...excludedTags, tag])}
                        onRemove={(tag) => setExcludedTags(excludedTags.filter((t) => t !== tag))}
                    />
                </div>
            </Clause>

            <Clause reference="§3" name="Authors" note="Leave this empty to admit everyone.">
                <UserAutocomplete
                    label="Admit only"
                    selectedUsers={selectedAuthors}
                    onUserAdd={(user) => setSelectedAuthors([...selectedAuthors, user])}
                    onUserRemove={(userId) =>
                        setSelectedAuthors(selectedAuthors.filter((author) => author._id !== userId))
                    }
                    placeholder="Search by username"
                />
            </Clause>

            <Clause reference="§4" name="Window">
                <Rail
                    name="window"
                    value={useDateRange ? 'between' : 'any'}
                    onChange={(value) => setUseDateRange(value === 'between')}
                    options={[
                        { value: 'any', label: 'Any time' },
                        { value: 'between', label: 'Between dates' },
                    ]}
                />

                {useDateRange && (
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="feed-start" className="t-label block">
                                From
                            </label>
                            <input
                                id="feed-start"
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="field field-sm mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="feed-end" className="t-label block">
                                To
                            </label>
                            <input
                                id="feed-end"
                                type="date"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="field field-sm mt-1"
                            />
                        </div>
                    </div>
                )}
            </Clause>

            <Clause reference="§5" name="Order">
                <Rail
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
                    <div className="mt-5">
                        <Rail
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

            <Clause reference="§6" name="Terms">
                <Rail
                    legend="Echoes you have already liked"
                    name="excludeLiked"
                    value={excludeLikedEchos ? 'hide' : 'show'}
                    onChange={(value) => setExcludeLikedEchos(value === 'hide')}
                    options={[
                        { value: 'show', label: 'Show them' },
                        { value: 'hide', label: 'Hide them' },
                    ]}
                />

                <div className="mt-6">
                    <Rail
                        legend="Visibility"
                        name="visibility"
                        value={isPrivate ? 'private' : 'public'}
                        onChange={(value) => setIsPrivate(value === 'private')}
                        options={[
                            { value: 'public', label: 'Public' },
                            { value: 'private', label: 'Private' },
                        ]}
                    />
                    <p className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                        {isPrivate
                            ? 'Only you can open this Feed.'
                            : 'Anyone can find this Feed and follow it.'}
                    </p>
                </div>
            </Clause>

            <section className="mt-12 border-t border-ink pt-6">
                <h2 className="t-label t-label--ink">The rule</h2>
                <p aria-live="polite" className="t-title mt-4">
                    {clauses.join(', ')}.
                </p>
            </section>

            <button type="submit" disabled={!canSubmit} className="act mt-10 h-12 w-full px-8">
                {isCreatingScroll ? 'Committing' : 'Commit this rule'}
            </button>
        </form>
    );
};

export default FeedForm;
