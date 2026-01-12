import React, { useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { useNavigate } from 'react-router-dom';
import { X, Hash, Users, Calendar, ArrowUpDown, Sparkles, Lock, Globe, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { UserAutocomplete } from '../ui';

const FeedForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    // Tag filtering
    const [tagMatchType, setTagMatchType] = useState('any');
    const [includedTags, setIncludedTags] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);
    const [includedTagInput, setIncludedTagInput] = useState('');
    const [excludedTagInput, setExcludedTagInput] = useState('');

    // Author filtering
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    // Date range
    const [useDateRange, setUseDateRange] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sorting
    const [sortBy, setSortBy] = useState('newestFirst');
    const [sortTimeRange, setSortTimeRange] = useState('allTime');

    // Options
    const [excludeLikedEchos, setExcludeLikedEchos] = useState(false);

    // Section expansion states
    const [expandedSections, setExpandedSections] = useState({
        tags: true,
        authors: false,
        date: false,
        sorting: false
    });

    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Tag handlers for included tags
    const handleIncludedTagInput = (e) => {
        const value = e.target.value;
        if (value.includes(' ') || value.includes(',')) {
            e.preventDefault();
            addIncludedTag(value.replace(/[, ]+/g, ''));
            setIncludedTagInput('');
            return;
        }
        setIncludedTagInput(value);
    };

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
    const handleExcludedTagInput = (e) => {
        const value = e.target.value;
        if (value.includes(' ') || value.includes(',')) {
            e.preventDefault();
            addExcludedTag(value.replace(/[, ]+/g, ''));
            setExcludedTagInput('');
            return;
        }
        setExcludedTagInput(value);
    };

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

    // Author handlers
    const handleAuthorAdd = (user) => {
        setSelectedAuthors([...selectedAuthors, user]);
    };

    const handleAuthorRemove = (userId) => {
        setSelectedAuthors(selectedAuthors.filter(author => author._id !== userId));
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
            authors: selectedAuthors.map(author => author._id),
            sortBy,
            sortTimeRange,
            excludeLikedEchos
        };

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
                feedConfig,
                isPrivate
            });

            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating feed:', error);
        }
    };

    const canSubmit = name.trim().length > 0 && !isCreatingScroll;

    // Count active filters for summary
    const activeFilters = [
        includedTags.length > 0 && `${includedTags.length} tag${includedTags.length > 1 ? 's' : ''}`,
        excludedTags.length > 0 && `${excludedTags.length} excluded`,
        selectedAuthors.length > 0 && `${selectedAuthors.length} author${selectedAuthors.length > 1 ? 's' : ''}`,
        useDateRange && 'date range'
    ].filter(Boolean);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name your feed"
                    className="w-full bg-transparent text-lg text-base-content placeholder:text-base-content/25 border-b border-base-content/10 pb-3 outline-none focus:border-base-content/30 transition-colors"
                    maxLength={50}
                    autoFocus
                />
                <div className="flex justify-end">
                    <span className="text-xs text-base-content/30">{name.length}/50</span>
                </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will this feed contain? (optional)"
                    className="w-full bg-transparent text-sm text-base-content placeholder:text-base-content/25 border-b border-base-content/10 pb-3 outline-none focus:border-base-content/30 transition-colors resize-none leading-relaxed"
                    rows={2}
                    maxLength={200}
                />
                <div className="flex justify-end">
                    <span className="text-xs text-base-content/30">{description.length}/200</span>
                </div>
            </div>

            {/* Filter Sections */}
            <div className="space-y-1">
                <p className="text-xs text-base-content/40 mb-3">Configure filters (all optional)</p>

                {/* Tags Section */}
                <div className="border border-base-content/5 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('tags')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-base-content/[0.02] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Hash className="w-4 h-4 text-base-content/40" />
                            <span className="text-sm text-base-content/70">Tags</span>
                            {includedTags.length > 0 && (
                                <span className="text-xs text-base-content/40">
                                    {includedTags.length} selected
                                </span>
                            )}
                        </div>
                        {expandedSections.tags ? (
                            <ChevronUp className="w-4 h-4 text-base-content/30" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-base-content/30" />
                        )}
                    </button>

                    {expandedSections.tags && (
                        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-base-content/5">
                            {/* Include Tags */}
                            <div className="pt-4">
                                <label className="text-xs text-base-content/50 mb-2 block">Include</label>
                                <div className="flex flex-wrap items-center gap-2 min-h-[36px] px-3 py-2 bg-base-content/[0.02] rounded-lg">
                                    {includedTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-base-content/10 text-base-content/70 text-xs rounded-full"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeIncludedTag(tag)}
                                                className="p-0.5 hover:text-base-content transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={includedTagInput}
                                        onChange={handleIncludedTagInput}
                                        onKeyDown={handleIncludedTagKeyDown}
                                        placeholder={includedTags.length === 0 ? "Type tags, press space to add..." : ""}
                                        className="flex-1 min-w-[120px] bg-transparent text-sm text-base-content placeholder:text-base-content/30 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Tag Match Type */}
                            {includedTags.length > 1 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-base-content/40">Match:</span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setTagMatchType('any')}
                                            className={`px-3 py-1 text-xs rounded-full transition-colors ${tagMatchType === 'any'
                                                    ? 'bg-base-content/10 text-base-content'
                                                    : 'text-base-content/40 hover:text-base-content/60'
                                                }`}
                                        >
                                            Any
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTagMatchType('all')}
                                            className={`px-3 py-1 text-xs rounded-full transition-colors ${tagMatchType === 'all'
                                                    ? 'bg-base-content/10 text-base-content'
                                                    : 'text-base-content/40 hover:text-base-content/60'
                                                }`}
                                        >
                                            All
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Exclude Tags */}
                            <div>
                                <label className="text-xs text-base-content/50 mb-2 block">Exclude</label>
                                <div className="flex flex-wrap items-center gap-2 min-h-[36px] px-3 py-2 bg-base-content/[0.02] rounded-lg">
                                    {excludedTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400/80 text-xs rounded-full"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeExcludedTag(tag)}
                                                className="p-0.5 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={excludedTagInput}
                                        onChange={handleExcludedTagInput}
                                        onKeyDown={handleExcludedTagKeyDown}
                                        placeholder={excludedTags.length === 0 ? "Tags to hide..." : ""}
                                        className="flex-1 min-w-[120px] bg-transparent text-sm text-base-content placeholder:text-base-content/30 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Authors Section */}
                <div className="border border-base-content/5 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('authors')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-base-content/[0.02] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-base-content/40" />
                            <span className="text-sm text-base-content/70">Authors</span>
                            {selectedAuthors.length > 0 && (
                                <span className="text-xs text-base-content/40">
                                    {selectedAuthors.length} selected
                                </span>
                            )}
                        </div>
                        {expandedSections.authors ? (
                            <ChevronUp className="w-4 h-4 text-base-content/30" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-base-content/30" />
                        )}
                    </button>

                    {expandedSections.authors && (
                        <div className="px-4 pb-4 pt-0 border-t border-base-content/5">
                            <div className="pt-4">
                                <p className="text-xs text-base-content/40 mb-3">
                                    Only show echos from these users
                                </p>
                                <UserAutocomplete
                                    selectedUsers={selectedAuthors}
                                    onUserAdd={handleAuthorAdd}
                                    onUserRemove={handleAuthorRemove}
                                    placeholder="Search users..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Date Range Section */}
                <div className="border border-base-content/5 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('date')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-base-content/[0.02] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-base-content/40" />
                            <span className="text-sm text-base-content/70">Date Range</span>
                            {useDateRange && (
                                <span className="text-xs text-base-content/40">
                                    enabled
                                </span>
                            )}
                        </div>
                        {expandedSections.date ? (
                            <ChevronUp className="w-4 h-4 text-base-content/30" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-base-content/30" />
                        )}
                    </button>

                    {expandedSections.date && (
                        <div className="px-4 pb-4 pt-0 border-t border-base-content/5">
                            <div className="pt-4 space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={useDateRange}
                                        onChange={(e) => setUseDateRange(e.target.checked)}
                                        className="w-4 h-4 rounded border-base-content/20 bg-transparent"
                                    />
                                    <span className="text-xs text-base-content/60">
                                        Limit to specific dates
                                    </span>
                                </label>

                                {useDateRange && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-base-content/40 mb-2 block">From</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 bg-base-content/[0.02] border border-base-content/5 rounded-lg text-sm text-base-content"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-base-content/40 mb-2 block">To</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 bg-base-content/[0.02] border border-base-content/5 rounded-lg text-sm text-base-content"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sorting Section */}
                <div className="border border-base-content/5 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('sorting')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-base-content/[0.02] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ArrowUpDown className="w-4 h-4 text-base-content/40" />
                            <span className="text-sm text-base-content/70">Sorting</span>
                            <span className="text-xs text-base-content/40">
                                {sortBy === 'newestFirst' ? 'Newest' : sortBy === 'oldestFirst' ? 'Oldest' : 'Popular'}
                            </span>
                        </div>
                        {expandedSections.sorting ? (
                            <ChevronUp className="w-4 h-4 text-base-content/30" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-base-content/30" />
                        )}
                    </button>

                    {expandedSections.sorting && (
                        <div className="px-4 pb-4 pt-0 border-t border-base-content/5">
                            <div className="pt-4 space-y-4">
                                <div className="flex gap-2">
                                    {[
                                        { value: 'newestFirst', label: 'Newest' },
                                        { value: 'oldestFirst', label: 'Oldest' },
                                        { value: 'mostLiked', label: 'Popular' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setSortBy(option.value)}
                                            className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${sortBy === option.value
                                                    ? 'bg-base-content/10 text-base-content'
                                                    : 'text-base-content/40 hover:text-base-content/60'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {sortBy === 'mostLiked' && (
                                    <div>
                                        <label className="text-xs text-base-content/40 mb-2 block">Time range</label>
                                        <select
                                            value={sortTimeRange}
                                            onChange={(e) => setSortTimeRange(e.target.value)}
                                            className="w-full px-3 py-2 bg-base-content/[0.02] border border-base-content/5 rounded-lg text-sm text-base-content"
                                        >
                                            <option value="1day">Last 24 hours</option>
                                            <option value="1month">Last month</option>
                                            <option value="1year">Last year</option>
                                            <option value="allTime">All time</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hide Liked Option */}
            <label className="flex items-center gap-3 cursor-pointer py-2">
                {excludeLikedEchos ? (
                    <EyeOff className="w-4 h-4 text-base-content/40" />
                ) : (
                    <Eye className="w-4 h-4 text-base-content/40" />
                )}
                <input
                    type="checkbox"
                    checked={excludeLikedEchos}
                    onChange={(e) => setExcludeLikedEchos(e.target.checked)}
                    className="sr-only"
                />
                <span className={`text-sm transition-colors ${excludeLikedEchos ? 'text-base-content/70' : 'text-base-content/40'}`}>
                    Hide echos I've already liked
                </span>
            </label>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between py-4 border-y border-base-content/5">
                <div className="flex items-center gap-3">
                    {isPrivate ? (
                        <Lock className="w-4 h-4 text-base-content/40" />
                    ) : (
                        <Globe className="w-4 h-4 text-base-content/40" />
                    )}
                    <div>
                        <p className="text-sm text-base-content/80">
                            {isPrivate ? 'Private' : 'Public'}
                        </p>
                        <p className="text-xs text-base-content/40">
                            {isPrivate
                                ? 'Only you can view this feed'
                                : 'Anyone can discover this feed'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${isPrivate ? 'bg-base-content/20' : 'bg-base-content/10'
                        }`}
                >
                    <span className={`absolute top-1 w-4 h-4 bg-base-content rounded-full transition-all ${isPrivate ? 'left-6' : 'left-1'
                        }`} />
                </button>
            </div>

            {/* Filter Summary */}
            {activeFilters.length > 0 && (
                <div className="text-xs text-base-content/40 text-center">
                    Filtering by: {activeFilters.join(' • ')}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${canSubmit
                        ? 'bg-base-content text-base-100 hover:bg-base-content/90'
                        : 'bg-base-content/5 text-base-content/30 cursor-not-allowed'
                    }`}
            >
                {isCreatingScroll ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Create Feed
                    </>
                )}
            </button>
        </form>
    );
};

export default FeedForm;
