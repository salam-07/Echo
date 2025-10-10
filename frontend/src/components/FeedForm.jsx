import React, { useState } from 'react';
import { useScrollStore } from '../store/useScrollStore';
import { useNavigate } from 'react-router-dom';
import { X, Hash } from 'lucide-react';

const FeedForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Tag filtering
    const [tagMatchType, setTagMatchType] = useState('any');
    const [includedTags, setIncludedTags] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);
    const [includedTagInput, setIncludedTagInput] = useState('');
    const [excludedTagInput, setExcludedTagInput] = useState('');

    // Date range
    const [useDateRange, setUseDateRange] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sorting
    const [sortBy, setSortBy] = useState('newestFirst');
    const [sortTimeRange, setSortTimeRange] = useState('allTime');

    // Options
    const [excludeLikedEchos, setExcludeLikedEchos] = useState(false);

    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    // Tag suggestions
    const tagSuggestions = [
        'tech', 'programming', 'ai', 'news', 'thoughts', 'life', 'work',
        'travel', 'food', 'books', 'music', 'art', 'fitness', 'learning'
    ];

    // Tag handlers for included tags
    const handleIncludedTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            addIncludedTag(includedTagInput.trim());
            setIncludedTagInput('');
        } else if (e.key === 'Backspace' && includedTagInput === '' && includedTags.length > 0) {
            setIncludedTags(includedTags.slice(0, -1));
        }
    };

    const addIncludedTag = (tag) => {
        const cleanTag = tag.replace(/^#/, '').trim().toLowerCase();
        if (cleanTag && !includedTags.includes(cleanTag)) {
            setIncludedTags([...includedTags, cleanTag]);
        }
    };

    const removeIncludedTag = (tagToRemove) => {
        setIncludedTags(includedTags.filter(tag => tag !== tagToRemove));
    };

    // Tag handlers for excluded tags
    const handleExcludedTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            addExcludedTag(excludedTagInput.trim());
            setExcludedTagInput('');
        } else if (e.key === 'Backspace' && excludedTagInput === '' && excludedTags.length > 0) {
            setExcludedTags(excludedTags.slice(0, -1));
        }
    };

    const addExcludedTag = (tag) => {
        const cleanTag = tag.replace(/^#/, '').trim().toLowerCase();
        if (cleanTag && !excludedTags.includes(cleanTag)) {
            setExcludedTags([...excludedTags, cleanTag]);
        }
    };

    const removeExcludedTag = (tagToRemove) => {
        setExcludedTags(excludedTags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        const feedConfig = {
            tagMatchType: includedTags.length > 0 ? tagMatchType : 'any',
            includedTags: includedTags,
            excludedTags: excludedTags,
            sortBy,
            sortTimeRange,
            excludeLikedEchos
        };

        // Add date range if enabled
        if (useDateRange) {
            feedConfig.dateRange = {
                startDate: startDate || undefined,
                endDate: endDate || undefined
            };
        }

        try {
            await createScroll({
                name: name.trim(),
                description: description.trim(),
                type: 'feed',
                feedConfig
            });

            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating feed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                        Feed Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tech News Feed"
                        className="w-full px-4 py-2.5 bg-base-100 border border-base-300 rounded-lg text-base-content placeholder:text-base-content/40"
                        maxLength={50}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Latest tech updates and news..."
                        className="w-full px-4 py-2.5 bg-base-100 border border-base-300 rounded-lg text-base-content placeholder:text-base-content/40 resize-none"
                        rows={2}
                        maxLength={200}
                    />
                </div>
            </div>

            {/* Tag Filtering */}
            <div className="space-y-4 p-4 bg-base-200/50 rounded-lg">
                <h3 className="text-sm font-semibold text-base-content/90">Tag Filters</h3>

                {/* Include Tags */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-base-content/60" />
                        <label className="text-xs font-medium text-base-content/70">
                            Include Tags
                        </label>
                    </div>

                    {/* Selected included tags */}
                    {includedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {includedTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeIncludedTag(tag)}
                                        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Tag input */}
                    <input
                        type="text"
                        value={includedTagInput}
                        onChange={(e) => setIncludedTagInput(e.target.value)}
                        onKeyDown={handleIncludedTagKeyDown}
                        placeholder="Type tags and press space or comma"
                        className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content placeholder:text-base-content/40"
                    />

                    {/* Suggestions */}
                    {includedTags.length === 0 && (
                        <div className="mt-2">
                            <span className="text-xs text-base-content/50 mb-1.5 block">Suggestions:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {tagSuggestions.slice(0, 6).map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => addIncludedTag(suggestion)}
                                        className="px-2 py-1 text-xs text-base-content/60 hover:text-base-content hover:bg-base-200/50 rounded-md transition-colors"
                                    >
                                        #{suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tag Match Type */}
                {includedTags.length > 0 && (
                    <div>
                        <label className="block text-xs font-medium text-base-content/70 mb-2">
                            Tag Match Type
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTagMatchType('all')}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${tagMatchType === 'all'
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-100 text-base-content/70 hover:bg-base-300/50'
                                    }`}
                            >
                                All Tags
                            </button>
                            <button
                                type="button"
                                onClick={() => setTagMatchType('any')}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${tagMatchType === 'any'
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-100 text-base-content/70 hover:bg-base-300/50'
                                    }`}
                            >
                                Any Tag
                            </button>
                        </div>
                    </div>
                )}

                {/* Exclude Tags */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-base-content/60" />
                        <label className="text-xs font-medium text-base-content/70">
                            Exclude Tags
                        </label>
                    </div>

                    {/* Selected excluded tags */}
                    {excludedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {excludedTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeExcludedTag(tag)}
                                        className="p-0.5 hover:bg-red-500/20 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Tag input */}
                    <input
                        type="text"
                        value={excludedTagInput}
                        onChange={(e) => setExcludedTagInput(e.target.value)}
                        onKeyDown={handleExcludedTagKeyDown}
                        placeholder="Type tags to exclude and press space or comma"
                        className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content placeholder:text-base-content/40"
                    />
                </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3 p-4 bg-base-200/50 rounded-lg">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-base-content/90">Date Range</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useDateRange}
                            onChange={(e) => setUseDateRange(e.target.checked)}
                            className="w-4 h-4 rounded border-base-300"
                        />
                        <span className="text-xs text-base-content/70">Enable</span>
                    </label>
                </div>

                {useDateRange && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-base-content/70 mb-2">
                                From
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-base-content/70 mb-2">
                                To
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Sorting */}
            <div className="space-y-3 p-4 bg-base-200/50 rounded-lg">
                <h3 className="text-sm font-semibold text-base-content/90">Sorting</h3>

                <div>
                    <label className="block text-xs font-medium text-base-content/70 mb-2">
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content"
                    >
                        <option value="newestFirst">Newest First</option>
                        <option value="oldestFirst">Oldest First</option>
                        <option value="mostLiked">Most Liked</option>
                    </select>
                </div>

                {sortBy === 'mostLiked' && (
                    <div>
                        <label className="block text-xs font-medium text-base-content/70 mb-2">
                            Time Range
                        </label>
                        <select
                            value={sortTimeRange}
                            onChange={(e) => setSortTimeRange(e.target.value)}
                            className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content"
                        >
                            <option value="1day">Last 24 Hours</option>
                            <option value="1month">Last Month</option>
                            <option value="1year">Last Year</option>
                            <option value="allTime">All Time</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Additional Options */}
            <div className="space-y-3 p-4 bg-base-200/50 rounded-lg">
                <h3 className="text-sm font-semibold text-base-content/90">Options</h3>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludeLikedEchos}
                        onChange={(e) => setExcludeLikedEchos(e.target.checked)}
                        className="w-4 h-4 rounded border-base-300"
                    />
                    <span className="text-sm text-base-content/80">Exclude Liked Echos</span>
                </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isCreatingScroll || !name.trim()}
                    className="w-full px-6 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isCreatingScroll ? 'Creating...' : 'Create Feed'}
                </button>
            </div>
        </form>
    );
};

export default FeedForm;
