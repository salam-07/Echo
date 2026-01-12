import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, Sparkles } from 'lucide-react';
import Layout from '../layouts/Layout';
import { useEchoStore } from '../store/useEchoStore';

const NewEcho = () => {
    const navigate = useNavigate();
    const { postEcho, isPostingEcho } = useEchoStore();
    const textareaRef = useRef(null);

    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    // Auto-focus and auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput.trim());
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const addTag = (tag) => {
        const cleanTag = tag.replace(/^#/, '').replace(/[, ]+/g, '').trim().toLowerCase();
        if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
            setTags([...tags, cleanTag]);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await postEcho({
                content: content.trim(),
                tags: tags
            });
            setContent('');
            setTags([]);
            setTagInput('');
            navigate('/');
        } catch (error) {
            console.log('Error posting echo:', error);
        }
    };

    const remainingChars = 1000 - content.length;
    const canSubmit = content.trim().length > 0 && !isPostingEcho;
    const charPercentage = (content.length / 1000) * 100;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
                {/* Minimal Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-base-content/40 hover:text-base-content/70 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-5 py-2 bg-base-content text-base-100 rounded-full text-sm font-medium transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPostingEcho ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span>{isPostingEcho ? 'Posting...' : 'Echo'}</span>
                    </button>
                </div>

                {/* Writing Area */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Textarea */}
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent text-base-content text-lg sm:text-xl leading-relaxed placeholder:text-base-content/25 resize-none border-none outline-none min-h-[200px]"
                            maxLength={1000}
                        />

                        {/* Character Progress Ring */}
                        {content.length > 0 && (
                            <div className="absolute bottom-0 right-0 flex items-center gap-2">
                                <div className="relative w-8 h-8">
                                    <svg className="w-8 h-8 -rotate-90">
                                        <circle
                                            cx="16"
                                            cy="16"
                                            r="12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            className="text-base-200"
                                        />
                                        <circle
                                            cx="16"
                                            cy="16"
                                            r="12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeDasharray={75.4}
                                            strokeDashoffset={75.4 - (75.4 * charPercentage) / 100}
                                            className={`transition-all ${remainingChars < 50
                                                ? 'text-warning'
                                                : remainingChars < 0
                                                    ? 'text-error'
                                                    : 'text-base-content/30'
                                                }`}
                                        />
                                    </svg>
                                    {remainingChars <= 100 && (
                                        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium ${remainingChars < 50 ? 'text-warning' : 'text-base-content/40'
                                            }`}>
                                            {remainingChars}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-base-200/50" />

                    {/* Tags Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Existing Tags */}
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-base-200/50 text-base-content/70 text-sm rounded-full"
                                >
                                    <span className="text-base-content/40">#</span>
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="p-0.5 hover:text-base-content transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {/* Tag Input */}
                            {tags.length < 20 && (
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value.replace(/[, ]+/g, ''))}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={tags.length === 0 ? "Add tags..." : "Add more..."}
                                    className="flex-1 min-w-[100px] bg-transparent text-sm text-base-content placeholder:text-base-content/30 outline-none"
                                />
                            )}
                        </div>

                        {tags.length === 0 && (
                            <p className="text-xs text-base-content/30">
                                Tags help others discover your echo. Press space or comma to add.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default NewEcho;