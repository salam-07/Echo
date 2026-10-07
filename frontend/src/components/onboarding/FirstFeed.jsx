import { useEffect, useMemo, useRef, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { Placeholder } from '../editorial/Apparatus';
import { Timestamp } from '../ui';

/**
 * The welcome sheet's second leaf, and the whole point of it: writing one rule and
 * watching the page become its output before a single thing is committed.
 *
 * This is a tightened cut of the full rule builder. That sheet has six clauses; a
 * first rule needs two — a tag to admit and an order to read it in — so that is all
 * this asks for. Everything else the Feed supports is left at a sensible default and
 * can be set later on the real builder.
 *
 * The demonstration is the argument. As tags are admitted, the right-hand column
 * fills with real Echos drawn from the whole corpus — not a mock, not the account's
 * own posts, but the same entries the committed Feed will hold, ordered the same
 * way. The reader sees control made real, then commits the thing they are already
 * looking at.
 *
 * The preview reads the corpus directly rather than through the echo store: that
 * store backs the live Home column, and a preview that runs on every tag tap has no
 * business writing to it. So the fetch is local and the ordering is done here, which
 * also keeps the preview honest — it is sorted by the same two rules the request
 * will carry, not by whatever the tag endpoint happened to return.
 */

/** The tags offered to a reader writing their first rule.
 *
 * They are drawn, not ranked. The old offer was the most-liked corner of the
 * corpus, which is the same eight names for every reader on every visit — a
 * suggestion that has already been made. A draw at least has the chance of
 * landing on the thing this particular reader came for.
 *
 * One request buys the whole pool and the row is dealt from it, so Shuffle costs
 * a state update rather than a round trip. Six turns before the pile runs low,
 * and it is topped up ahead of that, in the background, never in front of the
 * reader pressing the button. */
const SHOWN = 8;
const POOL = 48;
const MIN_FRESH = 3;
const REFILL_AT = 16;
const PREVIEW_SHOWN = 8;

/** One pool of candidates. A failure here is not an error state: the pool is
 * simply empty, the sheet falls back to naming your own tag, and the Shuffle
 * below it stands on the row it already has. */
const fetchTagPool = async () => {
    try {
        const res = await axiosInstance.get(`/community/tags/random?limit=${POOL}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch {
        return [];
    }
};

const titleCase = (tag) => (tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : '');

/** One entry, set exactly as the real column sets it — same byline, same measure,
 * same tag register — so the commit lands on a page that looks like the preview it
 * replaced. Non-interactive: the controls belong on the real sheet, not here. */
const Specimen = ({ echo }) => (
    <article className="border-b border-rule py-5">
        <header className="flex min-w-0 items-baseline gap-3">
            <span className="truncate text-[0.875rem] font-medium tracking-[0.01em] text-ink">
                @{echo.author?.userName || 'anonymous'}
            </span>
            <Timestamp date={echo.createdAt} className="t-readout shrink-0 text-rule-strong" />
        </header>
        <p className="t-body mt-3 whitespace-pre-wrap break-words text-ink">{echo.content}</p>
        {echo.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {echo.tags.map((tag) => (
                    <span key={tag._id || tag.name} className="t-readout text-rule-strong">
                        #{tag.name || tag}
                    </span>
                ))}
            </div>
        )}
    </article>
);

const FirstFeed = ({ onCommit, isCommitting, onBack }) => {
    /* The offer, and what is left of the pool it is dealt from. The pool is a
       ref, not state: nothing renders it, it is a supply rather than something
       the sheet shows, and keeping it out of state keeps every deal from
       dragging a render of the whole form behind it. */
    const [suggestions, setSuggestions] = useState([]);
    const [offerReady, setOfferReady] = useState(false);
    const pile = useRef([]);
    const refilling = useRef(false);

    const [included, setIncluded] = useState([]);
    const [draft, setDraft] = useState('');
    const [order, setOrder] = useState('newestFirst');
    const [name, setName] = useState('');
    const nameEdited = useRef(false);

    const [preview, setPreview] = useState([]);
    const [previewState, setPreviewState] = useState('idle'); // idle · loading · ready

    /* The opening offer. Every name that comes back has entries behind it — the
       endpoint samples Echos and reads the tags off them, so a tag cannot be
       suggested before something has been written under it. Admitting one can
       therefore only fill the column beside this, never empty it. */
    useEffect(() => {
        let live = true;
        (async () => {
            const names = await fetchTagPool();
            if (!live) return;
            pile.current = names.slice(SHOWN);
            setSuggestions(names.slice(0, SHOWN));
            setOfferReady(true);
        })();
        return () => {
            live = false;
        };
    }, []);

    /* Deal `count` names the row is not already showing. Names skipped as
       duplicates are dropped rather than returned: they are only in the pile
       once, and the row has already been offered them. */
    const draw = (count, exclude) => {
        const drawn = [];
        while (drawn.length < count && pile.current.length > 0) {
            const name = pile.current.shift();
            if (!exclude.has(name)) drawn.push(name);
        }
        return drawn;
    };

    /* Topping the pile up behind the row. The guard is what makes the second
       press of Shuffle safe — a refill is already on its way, and two in flight
       would deal the same name twice. */
    const refill = async (exclude) => {
        if (refilling.current) return;
        refilling.current = true;
        try {
            const names = await fetchTagPool();
            const held = new Set([...pile.current, ...exclude]);
            pile.current = [...pile.current, ...names.filter((name) => !held.has(name))];
        } finally {
            refilling.current = false;
        }
    };

    /* A new handful, keeping the tags already admitted exactly where they are and
       still on. Blanking a tag the reader has just chosen would read as the sheet
       overruling them, and it would take away the tap-again-to-remove that was
       how they chose it. They stay at the head of the row; the fresh names follow. */
    const shuffle = () => {
        const kept = suggestions.filter((tag) => included.includes(tag));
        const exclude = new Set([...kept, ...included]);
        const wanted = Math.max(MIN_FRESH, SHOWN - kept.length);
        const fresh = draw(wanted, exclude);

        /* A dry pile must not read as a sheet that has run out. The top-up goes
           out either way; if nothing came back the row simply stands, so a press
           never leaves less on the sheet than it found. */
        if (pile.current.length < REFILL_AT) refill(new Set([...kept, ...fresh, ...included]));
        if (fresh.length === 0) return;

        setSuggestions([...kept, ...fresh]);
    };

    /* The preview, re-drawn whenever the set of admitted tags changes. A union across
       the tags, de-duplicated by id — the same set a Feed with "any of them" holds. */
    useEffect(() => {
        if (included.length === 0) {
            setPreview([]);
            setPreviewState('idle');
            return;
        }
        let live = true;
        setPreviewState('loading');
        (async () => {
            const lists = await Promise.all(
                included.map((tag) =>
                    axiosInstance
                        .get(`/echo/tag/${encodeURIComponent(tag)}`)
                        .then((res) => res.data?.echos || [])
                        .catch(() => []),
                ),
            );
            if (!live) return;
            const byId = new Map();
            for (const echo of lists.flat()) {
                if (echo && echo._id) byId.set(echo._id, echo);
            }
            setPreview([...byId.values()]);
            setPreviewState('ready');
        })();
        return () => {
            live = false;
        };
    }, [included]);

    /* Ordering happens here, not on the server, so what is shown cannot drift from
       what the rule promises. Newest by filing date; most-liked by the like count. */
    const ordered = useMemo(() => {
        const rows = [...preview];
        if (order === 'mostLiked') {
            rows.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else {
            rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return rows;
    }, [preview, order]);

    const shown = ordered.slice(0, PREVIEW_SHOWN);

    /* The name follows the first tag until the reader touches it, then it is theirs. */
    const addTag = (tag) => {
        setIncluded((current) => {
            if (current.includes(tag)) return current;
            const next = [...current, tag];
            if (!nameEdited.current) setName(titleCase(tag));
            return next;
        });
    };

    const removeTag = (tag) => {
        setIncluded((current) => {
            const next = current.filter((t) => t !== tag);
            if (!nameEdited.current) setName(next.length ? titleCase(next[0]) : '');
            return next;
        });
    };

    const toggleTag = (tag) => (included.includes(tag) ? removeTag(tag) : addTag(tag));

    const commitDraft = (raw) => {
        const clean = raw
            .replace(/^#/, '')
            .replace(/[, ]+/g, '')
            .trim()
            .toLowerCase();
        if (clean) addTag(clean);
        setDraft('');
    };

    const handleDraftKey = (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            event.preventDefault();
            commitDraft(draft);
        } else if (event.key === 'Backspace' && draft === '' && included.length > 0) {
            removeTag(included[included.length - 1]);
        }
    };

    const ruleSentence =
        [
            order === 'mostLiked' ? 'Most liked of all time' : 'Newest first',
            included.length ? `tagged ${included.map((t) => `#${t}`).join(' or ')}` : null,
            'from anyone',
        ]
            .filter(Boolean)
            .join(', ') + '.';

    const canCommit = name.trim().length > 0 && included.length > 0 && !isCommitting;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!canCommit) return;
        onCommit({
            name: name.trim(),
            description: '',
            type: 'feed',
            feedConfig: {
                tagMatchType: 'any',
                includedTags: included,
                excludedTags: [],
                authors: [],
                sortBy: order,
                sortTimeRange: 'allTime',
                excludeLikedEchos: false,
            },
            isPrivate: false,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="animate-set-in">
            <header>
                <h1 className="t-headline max-w-[16ch]">Write the rule. See what it collects.</h1>
            </header>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16">
                {/* The rule — kept in view while the sheet beside it scrolls. */}
                <div className="lg:sticky lg:top-10 lg:self-start">
                    <section className="border-t border-rule pt-5">
                        <div className="flex items-baseline gap-3">
                            <span className="t-label text-rule-strong">§1</span>
                            <h2 className="t-label t-label--ink">Tags</h2>
                        </div>
                        <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                            Tap a tag to add it.
                        </p>

                        {!offerReady ? (
                            /* Bars the size of the chips they stand for, not one
                               long rule: in this column the row wraps to three
                               lines, and a single bar would hand the sheet a
                               height the real tags are about to contradict. */
                            <ul className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
                                {['5.5rem', '6.75rem', '4.5rem', '7rem', '5.25rem', '6rem'].map(
                                    (width) => (
                                        <li
                                            key={width}
                                            style={{ width }}
                                            className="h-8 animate-pulse bg-paper-dim"
                                        />
                                    ),
                                )}
                            </ul>
                        ) : suggestions.length > 0 ? (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {suggestions.map((tag, index) => (
                                    /* Keyed by name, so a name the row keeps is the
                                       same node and does not re-enter; only the names
                                       a shuffle actually replaced are new here, and
                                       only those print. */
                                    <li key={tag}>
                                        <button
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            data-state={included.includes(tag) ? 'in' : 'unset'}
                                            aria-pressed={included.includes(tag)}
                                            style={{ animationDelay: `${index * 24}ms` }}
                                            className="stamp animate-set-in px-3 py-1.5 text-[0.8125rem] leading-[1.4]"
                                        >
                                            #{tag}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        onClick={shuffle}
                                        className="stamp stamp-draw px-3 py-1.5 text-[0.8125rem] leading-[1.4]"
                                    >
                                        Shuffle
                                    </button>
                                </li>
                            </ul>
                        ) : (
                            <p className="mt-4 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                                No tags yet. Name one below, and your Feed will collect entries as they are
                                written.
                            </p>
                        )}

                        <label htmlFor="first-feed-tag" className="sr-only">
                            Add a tag
                        </label>
                        <input
                            id="first-feed-tag"
                            type="text"
                            value={draft}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value.includes(' ') || value.includes(',')) commitDraft(value);
                                else setDraft(value);
                            }}
                            onKeyDown={handleDraftKey}
                            placeholder="or name your own"
                            className="field field-sm mt-3"
                            autoComplete="off"
                        />

                        {included.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {included.map((tag) => (
                                    <li key={tag} data-state="in" className="stamp px-3 py-1.5">
                                        <span className="text-[0.8125rem] leading-[1.4]">#{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            aria-label={`Remove #${tag}`}
                                            className="stamp-state t-label text-[0.625rem] opacity-70 transition-opacity hover:opacity-100"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="mt-8 border-t border-rule pt-5">
                        <div className="flex items-baseline gap-3">
                            <span className="t-label text-rule-strong">§2</span>
                            <h2 className="t-label t-label--ink">Order</h2>
                        </div>
                        <div className="mt-4 flex border border-rule">
                            {[
                                { value: 'newestFirst', label: 'Newest' },
                                { value: 'mostLiked', label: 'Most liked' },
                            ].map((option, index) => (
                                <label
                                    key={option.value}
                                    data-held={order === option.value || undefined}
                                    className={`stop t-label h-11 flex-1 whitespace-nowrap px-4 ${
                                        index > 0 ? 'border-l border-rule' : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="first-feed-order"
                                        className="sr-only"
                                        checked={order === option.value}
                                        onChange={() => setOrder(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="mt-8 border-t border-rule pt-5">
                        <label htmlFor="first-feed-name" className="t-label t-label--ink block">
                            Name this Feed
                        </label>
                        <input
                            id="first-feed-name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                nameEdited.current = true;
                                setName(event.target.value);
                            }}
                            className="field mt-2"
                            maxLength={50}
                        />
                    </section>

                    <section className="mt-8 border-t border-ink pt-5">
                        <h2 className="t-label t-label--ink">The rule</h2>
                        <p aria-live="polite" className="t-title mt-3">
                            {ruleSentence}
                        </p>
                    </section>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button type="submit" disabled={!canCommit} className="act h-12 px-8">
                            {isCommitting ? 'Creating' : 'Create this Feed'}
                        </button>
                        <button type="button" onClick={onBack} className="act act-quiet h-12 px-5">
                            Back
                        </button>
                    </div>
                    {included.length === 0 && (
                        <p className="mt-4 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                            Add at least one tag to create your Feed.
                        </p>
                    )}
                </div>

                {/* The sheet the rule produces. */}
                <div className="lg:border-l lg:border-rule lg:pl-16">
                    <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
                        <p className="t-label t-label--ink">Preview</p>
                        {previewState === 'ready' && ordered.length > 0 && (
                            <p className="t-readout text-ink-quiet">{ordered.length} Echos</p>
                        )}
                    </div>

                    {previewState === 'idle' ? (
                        <p className="t-body max-w-[42ch] py-14 text-ink-quiet">
                            Add a tag and this page fills with real Echos, the same ones your Feed will hold,
                            ordered the way your rule says.
                        </p>
                    ) : previewState === 'loading' ? (
                        <Placeholder rows={4} />
                    ) : ordered.length === 0 ? (
                        <div className="py-14">
                            <p className="t-title max-w-[22em]">No Echos match this rule yet.</p>
                            <p className="t-body mt-4 max-w-[46ch] text-ink-soft">
                                Your Feed is still created. Echos appear here the moment someone writes one
                                tagged {included.map((t) => `#${t}`).join(' or ')}.
                            </p>
                        </div>
                    ) : (
                        <div key={`${included.join('|')}::${order}`} className="animate-set-in">
                            {shown.map((echo) => (
                                <Specimen key={echo._id} echo={echo} />
                            ))}
                            {ordered.length > shown.length && (
                                <p className="t-readout py-5 text-ink-quiet">
                                    Showing the first {shown.length} of {ordered.length} Echos.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default FirstFeed;
