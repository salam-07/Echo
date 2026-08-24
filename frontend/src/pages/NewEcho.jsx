import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Measure, SheetHead } from '../components/editorial/Apparatus';
import { useEchoStore } from '../store/useEchoStore';

const LIMIT = 1000;
const MAX_TAGS = 10;

/**
 * Writing an echo. The sheet is the page: no framed box around the text, because a
 * box would make the writing an input rather than a manuscript. A hairline holds
 * the bottom of the measure, the count sits in the margin of that rule, and the
 * tags are stamps below it.
 */
const NewEcho = () => {
    const navigate = useNavigate();
    const { postEcho, isPostingEcho } = useEchoStore();
    const textareaRef = useRef(null);

    const [content, setContent] = useState('');
    const [draft, setDraft] = useState('');
    const [tags, setTags] = useState([]);

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

    const addTag = (raw) => {
        const clean = raw.replace(/^#/, '').replace(/[, ]+/g, '').trim().toLowerCase();
        if (clean && !tags.includes(clean) && tags.length < MAX_TAGS) setTags([...tags, clean]);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim()) return;

        try {
            await postEcho({ content: content.trim(), tags });
            navigate('/');
        } catch (error) {
            console.log('Error posting echo:', error);
        }
    };

    const remaining = LIMIT - content.length;
    const canSubmit = content.trim().length > 0 && !isPostingEcho;

    return (
        <Layout>
            <Measure>
                <SheetHead label="" subject="Post an Echo" />

                <form onSubmit={handleSubmit}>
                    <label htmlFor="echo-content" className="sr-only">
                        Your echo
                    </label>
                    <textarea
                        ref={textareaRef}
                        id="echo-content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write here."
                        maxLength={LIMIT}
                        className="manuscript min-h-[13rem] w-full resize-none border-none bg-transparent text-[1.0625rem] leading-[1.7] text-ink placeholder:text-rule-strong sm:text-[1.125rem]"
                    />

                    <div className="flex items-baseline justify-between gap-6 border-t border-rule pt-3">
                        <p className="t-label">{tags.length ? `${tags.length} of ${MAX_TAGS} tags` : 'No tags'}</p>
                        <p className={`t-readout ${remaining <= 80 ? 'text-ink' : 'text-rule-strong'}`}>
                            {content.length}/{LIMIT}
                        </p>
                    </div>

                    <div className="mt-8">
                        <label htmlFor="echo-tags" className="t-label t-label--ink block">
                            Tags
                        </label>
                        <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                            Up to ten. Type one and press space. Tags are how a rule finds this echo.
                        </p>
                        <input
                            id="echo-tags"
                            type="text"
                            value={draft}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value.includes(' ') || value.includes(',')) {
                                    addTag(value);
                                    setDraft('');
                                    return;
                                }
                                setDraft(value);
                            }}
                            onKeyDown={handleTagKeyDown}
                            placeholder={tags.length >= MAX_TAGS ? 'Five is the limit' : 'poetry, cities'}
                            disabled={tags.length >= MAX_TAGS}
                            className="field field-sm mt-3"
                            autoComplete="off"
                        />

                        {tags.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <li key={tag} data-state="in" className="stamp px-3 py-1.5">
                                        <span className="text-[0.8125rem] leading-[1.4]">#{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => setTags(tags.filter((item) => item !== tag))}
                                            aria-label={`Remove #${tag}`}
                                            className="stamp-state t-label text-[0.625rem] opacity-70 transition-opacity hover:opacity-100"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink pt-6">
                        <button type="submit" disabled={!canSubmit} className="act h-12 px-8">
                            {isPostingEcho ? 'Posting' : 'Post this echo'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="act act-quiet h-12 px-6"
                        >
                            Discard
                        </button>
                    </div>
                </form>
            </Measure>
        </Layout>
    );
};

export default NewEcho;
