import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ReplyInput = ({ onSubmit, isSubmitting }) => {
    const [comment, setComment] = useState('');
    const maxLength = 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim() && !isSubmitting) {
            onSubmit(comment.trim());
            setComment('');
        }
    };

    const handleKeyDown = (e) => {
        // Submit on Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const remainingChars = maxLength - comment.length;
    const isOverLimit = remainingChars < 0;

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary/50 transition-colors"
                disabled={isSubmitting}
                maxLength={maxLength}
            />

            <button
                type="submit"
                disabled={!comment.trim() || isSubmitting || isOverLimit}
                className="p-2 rounded-lg bg-primary text-primary-content hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send reply"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
};

export default ReplyInput;
