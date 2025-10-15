import React, { useState, useEffect, useRef } from 'react';
import { X, Search, User as UserIcon } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

/**
 * UserAutocomplete - A component for searching and selecting users
 * @param {Array} selectedUsers - Array of selected user objects {_id, userName}
 * @param {Function} onUserAdd - Callback when a user is added
 * @param {Function} onUserRemove - Callback when a user is removed
 * @param {string} placeholder - Input placeholder text
 */
const UserAutocomplete = ({ selectedUsers = [], onUserAdd, onUserRemove, placeholder = "Search users by username..." }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                searchUsers(searchQuery);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayTimer);
    }, [searchQuery]);

    const searchUsers = async (query) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/search/users?q=${encodeURIComponent(query)}`);
            // Filter out already selected users
            const filteredUsers = res.data.users.filter(
                user => !selectedUsers.some(selected => selected._id === user._id)
            );
            setSuggestions(filteredUsers);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error searching users:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSelect = (user) => {
        onUserAdd(user);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(true);
    };

    return (
        <div className="space-y-3">
            {/* Selected Users */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                        <div
                            key={user._id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                        >
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>@{user.userName}</span>
                            <button
                                type="button"
                                onClick={() => onUserRemove(user._id)}
                                className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div ref={wrapperRef} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => searchQuery && setShowSuggestions(true)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary/50"
                    />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (searchQuery.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-3 text-sm text-base-content/60 text-center">
                                Searching...
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((user) => (
                                <button
                                    key={user._id}
                                    type="button"
                                    onClick={() => handleUserSelect(user)}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-base-200 transition-colors text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm text-base-content">@{user.userName}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-base-content/60 text-center">
                                No users found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAutocomplete;
