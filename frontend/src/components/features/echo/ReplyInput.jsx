import React, { useState } from 'react';

/**
 * A reply, written on one line. The field is a hairline; the action beside it is a
 * word. The counter only appears once you are close enough to the limit for it to
 * be news.
 */
const MAX = 500;

const ReplyInput = ({ onSubmit, isSubmitting }) => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const remaining = MAX - comment.length;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (comment.trim() && !isSubmitting) {
            setError('');
            try {
                await onSubmit(comment.trim());
                setComment('');
            } catch {
                setError('Couldn’t post your reply. Try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="reply-field" className="t-label mb-2 block">
                Write a reply
            </label>
            <div className="flex items-end gap-4">
                <input
                    id="reply-field"
                    type="text"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Add to the conversation…"
                    disabled={isSubmitting}
                    maxLength={MAX}
                    className="field field-sm min-w-0 flex-1"
                    aria-describedby={error ? 'reply-error' : undefined}
                />
                <button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="act h-11 shrink-0 px-4"
                >
                    {isSubmitting ? 'Posting…' : 'Reply'}
                </button>
            </div>
            {remaining <= 80 && (
                <p aria-live="polite" className="t-readout mt-2 text-ink-quiet">
                    {remaining} characters left
                </p>
            )}
            {error && <p id="reply-error" role="alert" className="mt-3 text-sm text-alarm">{error}</p>}
        </form>
    );
};

export default ReplyInput;
