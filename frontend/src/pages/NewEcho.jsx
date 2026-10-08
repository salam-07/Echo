import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Measure, SheetHead } from '../components/editorial/Apparatus';
import { useEchoStore } from '../store/useEchoStore';

const LIMIT = 1000;
const MAX_TAGS = 10;

const NewEcho = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { postEcho, isPostingEcho, suggestTags, isSuggestingEcho } = useEchoStore();
    const textareaRef = useRef(null);

    const [content, setContent] = useState('');
    const [draft, setDraft] = useState('');
    const [tags, setTags] = useState(() => [...new Set((params.get('tag') ?? '').split(/[,\s]+/)
        .map((tag) => tag.replace(/^#/, '').toLowerCase()).filter(Boolean))].slice(0, MAX_TAGS));

    // Suggestions are offered only when asked for, so nothing is fetched until the
    // button is pressed. `suggestState` is idle until then.
    const [suggestions, setSuggestions] = useState([]);
    const [suggestState, setSuggestState] = useState('idle');

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleContentChange = (event) => {
        setContent(event.target.value);
        const field = textareaRef.current;
        if (field) {
            field.style.height = 'auto';
            field.style.height = `${field.scrollHeight}px`;
        }
    };

    const parseTags = (raw) => raw.split(/[,\s]+/)
        .map((tag) => tag.replace(/^#/, '').toLowerCase()).filter(Boolean);
    const addTag = (raw) => {
        setTags((current) => [...new Set([...current, ...parseTags(raw)])].slice(0, MAX_TAGS));
    };

    const handleTagKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            event.preventDefault();
            addTag(draft);
            setDraft('');
        } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    // Ask the corpus which of its own tags this draft belongs under. The draft and
    // the tags already chosen both go along so the answer never repeats what the
    // author has already said.
    const handleSuggest = async () => {
        if (!content.trim() || isSuggestingEcho) return;
        try {
            const found = await suggestTags(content.trim(), tags);
            setSuggestions(found);
            setSuggestState(found.length > 0 ? 'ready' : 'empty');
        } catch {
            setSuggestions([]);
            setSuggestState('error');
        }
    };

    const openSuggestions = suggestions.filter((item) => !tags.includes(item.name));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim() || isPostingEcho) return;

        try {
            const postedTags = [...new Set([...tags, ...parseTags(draft)])].slice(0, MAX_TAGS);
            await postEcho({ content: content.trim(), tags: postedTags });
            navigate('/');
        } catch (error) {
            console.log('Error posting echo:', error);
        }
    };

    const remaining = LIMIT - content.length;
    const canSubmit = content.trim().length > 0 && !isPostingEcho;

    return (
        <Layout>
            <Measure className="pb-16">
                <SheetHead label="" subject="Post an Echo" />

                <form onSubmit={handleSubmit}>
                    <label htmlFor="echo-content" className="sr-only">
                        Your Echo
                    </label>
                    <textarea
                        ref={textareaRef}
                        id="echo-content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="What would you like to share?"
                        maxLength={LIMIT}
                        className="manuscript min-h-[13rem] w-full resize-none border-none bg-transparent text-[1.0625rem] leading-[1.7] text-ink placeholder:text-ink-quiet sm:text-[1.125rem]"
                        aria-describedby="echo-count"
                    />

                    <div className="flex justify-end pt-3">
                        <p id="echo-count" className={`t-readout ${remaining <= 80 ? 'text-ink' : 'text-ink-quiet'}`}>
                            {remaining} characters left
                        </p>
                    </div>

                    <div className="mt-8">
                        <label htmlFor="echo-tags" className="t-label t-label--ink block">
                            Tags (optional)
                        </label>
                        <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                            Help your Echo find its people. Up to {MAX_TAGS} tags.
                        </p>
                        <div className="mt-3 flex items-end gap-3">
                        <input
                            id="echo-tags"
                            type="text"
                            value={draft}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (/[,\s]/.test(value)) {
                                    addTag(value);
                                    setDraft('');
                                    return;
                                }
                                setDraft(value);
                            }}
                            onKeyDown={handleTagKeyDown}
                            placeholder={tags.length >= MAX_TAGS ? '10-tag limit reached' : 'e.g. poetry'}
                            disabled={tags.length >= MAX_TAGS}
                            className="field field-sm min-w-0 flex-1"
                            autoComplete="off"
                        />
                        <button type="button" disabled={!draft.trim() || tags.length >= MAX_TAGS}
                            onClick={() => { addTag(draft); setDraft(''); }} className="act act-quiet h-11 shrink-0 px-4">Add tag</button>
                        </div>

                        {tags.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <li key={tag} data-state="in" className="stamp max-w-full px-3 py-1.5">
                                        <span className="min-w-0 break-all text-[0.8125rem] leading-[1.4]">#{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => setTags(tags.filter((item) => item !== tag))}
                                            aria-label={`Remove #${tag}`}
                                            className="stamp-state t-label min-h-8 shrink-0 text-chalk-quiet hover:text-chalk"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-8 border-t border-rule pt-5">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-3">
                            <div>
                                <h2 id="echo-suggest-label" className="t-label t-label--ink">Suggested tags</h2>
                                <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                                    Ask the corpus which tags this Echo belongs under. Each answer says
                                    how many Echos carry it and how many Feeds it reaches.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSuggest}
                                disabled={!content.trim() || isSuggestingEcho || tags.length >= MAX_TAGS}
                                aria-describedby="echo-suggest-label"
                                className="act act-quiet h-11 shrink-0 px-4"
                            >
                                {isSuggestingEcho ? 'Reading…' : 'Suggest tags'}
                            </button>
                        </div>

                        {suggestState === 'ready' && openSuggestions.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {openSuggestions.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            type="button"
                                            onClick={() => addTag(item.name)}
                                            aria-label={`Add #${item.name}`}
                                            className="stamp max-w-full px-3 py-1.5"
                                        >
                                            <span className="min-w-0 break-all text-[0.8125rem] leading-[1.4]">
                                                #{item.name}
                                            </span>
                                            <span className="stamp-state t-readout shrink-0 text-ink-quiet">
                                                {item.echoCount} {item.echoCount === 1 ? 'Echo' : 'Echos'}
                                                {' · '}
                                                {item.feedCount} {item.feedCount === 1 ? 'Feed' : 'Feeds'}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {suggestState === 'ready' && openSuggestions.length === 0 && (
                            <p className="mt-4 text-[0.8125rem] text-ink-quiet">
                                Every tag that fits is already on the Echo.
                            </p>
                        )}

                        {suggestState === 'empty' && (
                            <p className="mt-4 text-[0.8125rem] text-ink-quiet">
                                No tag fits this yet.
                            </p>
                        )}

                        {suggestState === 'error' && (
                            <p className="mt-4 text-[0.8125rem] text-ink-quiet">
                                Couldn't read the corpus just now. Try again in a moment.
                            </p>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button type="submit" disabled={!canSubmit} className="act h-12 px-8">
                            {isPostingEcho ? 'Posting…' : 'Post Echo'}
                        </button>
                        <button
                            type="button"
                            disabled={isPostingEcho}
                            onClick={() => navigate(-1)}
                            className="act act-quiet h-12 px-6"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Measure>
        </Layout>
    );
};

export default NewEcho;
