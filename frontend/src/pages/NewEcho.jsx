import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Hash, Send, ArrowLeft } from 'lucide-react';
import Layout from '../layouts/Layout';
import { useEchoStore } from '../store/useEchoStore';

const NewEcho = () => {
    const navigate = useNavigate();
    const { postEcho, isPostingEcho } = useEchoStore();

    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    // Common tag suggestions for better UX
    const tagSuggestions = [
        'thoughts', 'tech', 'life', 'work', 'travel', 'food', 'books',
        'music', 'art', 'nature', 'fitness', 'learning', 'personal', 'news'
    ];

    const handleTagInput = (e) => {
        const value = e.target.value;

        // Handle space, comma, or enter to add tag
        if (value.includes(' ') || value.includes(',') || e.key === 'Enter') {
            e.preventDefault();
            addTag(value.replace(/[, ]+/g, ''));
            setTagInput('');
            return;
        }

        setTagInput(value);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput.trim());
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            // Remove last tag when backspacing with empty input
            setTags(tags.slice(0, -1));
        }
    };

    const addTag = (tag) => {
        const cleanTag = tag.replace(/^#/, '').trim().toLowerCase();
        if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
            setTags([...tags, cleanTag]);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const addSuggestedTag = (tag) => {
        if (!tags.includes(tag) && tags.length < 5) {
            setTags([...tags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            await postEcho({
                content: content.trim(),
                tags: tags
            });

            // Clear form and navigate back
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

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-base-content" />
                    </button>
                    <h1 className="text-xl font-semibold text-base-content">Create Echo</h1>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Content Input */}
                    <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's echoing in your mind?"
                            className="w-full bg-transparent text-base-content placeholder-base-content/50 resize-none border-none outline-none text-lg leading-relaxed"
                            rows={6}
                            maxLength={1000}
                        />

                        {/* Character Counter */}
                        <div className="flex justify-end mt-2">
                            <span className={`text-xs ${remainingChars < 50
                                    ? 'text-warning'
                                    : remainingChars < 0
                                        ? 'text-error'
                                        : 'text-base-content/50'
                                }`}>
                                {remainingChars} characters remaining
                            </span>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Hash className="w-4 h-4 text-base-content/60" />
                            <span className="text-sm font-medium text-base-content">Tags</span>
                            <span className="text-xs text-base-content/50">({tags.length}/5)</span>
                        </div>

                        {/* Selected Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Tag Input */}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={handleTagInput}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Add tags (space or comma to add)"
                            className="w-full bg-transparent text-base-content placeholder-base-content/50 border-none outline-none text-sm"
                            disabled={tags.length >= 5}
                        />

                        {/* Tag Suggestions */}
                        <div className="mt-3">
                            <span className="text-xs text-base-content/50 mb-2 block">Suggestions:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {tagSuggestions
                                    .filter(suggestion => !tags.includes(suggestion))
                                    .slice(0, 8)
                                    .map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => addSuggestedTag(suggestion)}
                                            className="px-2 py-1 text-xs text-base-content/60 hover:text-base-content hover:bg-base-200/50 rounded-md transition-colors"
                                            disabled={tags.length >= 5}
                                        >
                                            #{suggestion}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${canSubmit
                                    ? 'bg-primary text-primary-content hover:bg-primary/90'
                                    : 'bg-base-300 text-base-content/50 cursor-not-allowed'
                                }`}
                        >
                            {isPostingEcho ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Post Echo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default NewEcho;