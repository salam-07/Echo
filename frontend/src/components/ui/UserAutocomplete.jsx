import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../lib/axios';

/**
 * Naming the authors a rule admits.
 *
 * Each chosen author is a stamp — the same three-state control the tag filters
 * use, held here in its admitted state — and the way to take one out is the word
 * `Remove`, not a glyph. The suggestion list is paper on paper, separated by a
 * full ink border rather than a shadow, because a shadow implies a light source
 * and there is none in this document.
 */
const UserAutocomplete = ({
    selectedUsers = [],
    onUserAdd,
    onUserRemove,
    placeholder = 'Search by username',
    label = 'Authors',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    const fieldId = React.useId();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            const filteredUsers = res.data.users.filter(
                (user) => !selectedUsers.some((selected) => selected._id === user._id),
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

    return (
        <div>
            {selectedUsers.length > 0 && (
                <ul className="mb-4 flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                        <li key={user._id} className="stamp px-3 py-1.5" data-state="in">
                            <span className="text-[0.8125rem] leading-[1.4]">@{user.userName}</span>
                            <button
                                type="button"
                                onClick={() => onUserRemove(user._id)}
                                aria-label={`Remove @${user.userName}`}
                                className="t-label text-[0.625rem] text-chalk-quiet transition-colors hover:text-chalk"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div ref={wrapperRef} className="relative">
                <label htmlFor={fieldId} className="t-label t-label--ink block">
                    {label}
                </label>
                <input
                    id={fieldId}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="field field-sm mt-1"
                />

                {showSuggestions && searchQuery.length > 0 && (
                    <div className="absolute z-20 mt-px max-h-64 w-full overflow-y-auto border border-ink bg-paper">
                        {isLoading ? (
                            <p className="px-4 py-3 text-[0.8125rem] text-ink-quiet">Searching…</p>
                        ) : suggestions.length > 0 ? (
                            <ul>
                                {suggestions.map((user) => (
                                    <li key={user._id} className="border-b border-rule last:border-b-0">
                                        <button
                                            type="button"
                                            onClick={() => handleUserSelect(user)}
                                            className="flex min-h-11 w-full items-center px-4 text-left text-[0.875rem] text-ink transition-colors hover:bg-ink hover:text-paper"
                                        >
                                            @{user.userName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-4 py-3 text-[0.8125rem] text-ink-quiet">
                                No user by that name.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAutocomplete;
