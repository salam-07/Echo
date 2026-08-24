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

/** popularEchos-derived starters are guaranteed to have entries behind them, so the
 * preview never opens on an empty page. Sorted by likes upstream, so the tags a
 * reader is most likely to recognise surface first. */
const STARTER_COUNT = 8;
const PREVIEW_SHOWN = 8;

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
    const [starters, setStarters] = useState([]);
    const [startersReady, setStartersReady] = useState(false);

    const [included, setIncluded] = useState([]);
    const [draft, setDraft] = useState('');
    const [order, setOrder] = useState('newestFirst');
    const [name, setName] = useState('');
    const nameEdited = useRef(false);

    const [preview, setPreview] = useState([]);
    const [previewState, setPreviewState] = useState('idle'); // idle · loading · ready

    /* Starter tags: the most-liked corner of the corpus, reduced to the distinct
       tags carried there. Every one is known to have entries, so admitting it can
       only fill the page, never empty it. */
    useEffect(() => {
        let live = true;
        (async () => {
            try {
                const res = await axiosInstance.get('/community/echos/popular?limit=60');
                const seen = [];
                for (const echo of res.data || []) {
                    for (const tag of echo.tags || []) {
                        const nm = tag.name || tag;
                        if (nm && !seen.includes(nm)) seen.push(nm);
                    }
                }
                if (live) setStarters(seen.slice(0, STARTER_COUNT));
            } catch {
                if (live) setStarters([]);
            } finally {
                if (live) setStartersReady(true);
            }
        })();
        return () => {
            live = false;
        };
    }, []);

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
                <p className="t-label t-label--ink">Your first Feed</p>
                <h1 className="t-headline mt-5 max-w-[16ch]">Write the rule. Watch the page obey.</h1>
                <p className="t-body mt-4 max-w-[52ch] text-ink-soft">
                    Admit a tag or two and pick an order. The page fills with real Echos as you go — the same
                    ones your Feed will hold once you commit it.
                </p>
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
                            Tap one to admit it. Admitted tags are set solid.
                        </p>

                        {!startersReady ? (
                            <div className="mt-4 h-8 w-full animate-pulse bg-paper-dim" aria-hidden="true" />
                        ) : starters.length > 0 ? (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {starters.map((tag) => (
                                    <li key={tag}>
                                        <button
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            data-state={included.includes(tag) ? 'in' : 'unset'}
                                            aria-pressed={included.includes(tag)}
                                            className="stamp px-3 py-1.5 text-[0.8125rem] leading-[1.4]"
                                        >
                                            #{tag}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                                No tags in the record yet — name one below and your Feed will collect entries
                                as they are written.
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
                            placeholder="Name this rule"
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
                            {isCommitting ? 'Committing' : 'Commit this rule'}
                        </button>
                        <button type="button" onClick={onBack} className="act act-quiet h-12 px-5">
                            Back
                        </button>
                    </div>
                    {included.length === 0 && (
                        <p className="mt-4 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                            Admit at least one tag to commit your first rule.
                        </p>
                    )}
                </div>

                {/* The sheet the rule produces. */}
                <div className="lg:border-l lg:border-rule lg:pl-16">
                    <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
                        <p className="t-label t-label--ink">The page, as ruled</p>
                        {previewState === 'ready' && ordered.length > 0 && (
                            <p className="t-readout text-ink-quiet">Admitted {ordered.length}</p>
                        )}
                    </div>

                    {previewState === 'idle' ? (
                        <p className="t-body max-w-[42ch] py-14 text-ink-quiet">
                            Admit a tag, and this page fills with real Echos — the same ones your Feed will
                            hold, ordered exactly as your rule says.
                        </p>
                    ) : previewState === 'loading' ? (
                        <Placeholder rows={4} />
                    ) : ordered.length === 0 ? (
                        <div className="py-14">
                            <p className="t-title max-w-[22em]">This rule admits nothing yet.</p>
                            <p className="t-body mt-4 max-w-[46ch] text-ink-soft">
                                It still becomes your Feed. Entries appear here the moment someone writes one
                                under {included.map((t) => `#${t}`).join(' or ')}.
                            </p>
                        </div>
                    ) : (
                        <div key={`${included.join('|')}::${order}`} className="animate-set-in">
                            {shown.map((echo) => (
                                <Specimen key={echo._id} echo={echo} />
                            ))}
                            {ordered.length > shown.length && (
                                <p className="t-readout py-5 text-ink-quiet">
                                    Showing the first {shown.length}. Your Feed holds all {ordered.length}.
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
