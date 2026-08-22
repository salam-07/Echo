import React, { useState } from 'react';

/**
 * A reply, written on one line. The field is a hairline; the action beside it is a
 * word. The counter only appears once you are close enough to the limit for it to
 * be news.
 */
const MAX = 500;

const ReplyInput = ({ onSubmit, isSubmitting }) => {
    const [comment, setComment] = useState('');
    const remaining = MAX - comment.length;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (comment.trim() && !isSubmitting) {
            onSubmit(comment.trim());
            setComment('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="reply-field" className="sr-only">
                Write a reply
            </label>
            <div className="flex items-end gap-4">
                <input
                    id="reply-field"
                    type="text"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Write a reply"
                    disabled={isSubmitting}
                    maxLength={MAX}
                    className="field field-sm"
                />
                <button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="act h-10 shrink-0 px-6"
                >
                    {isSubmitting ? 'Sending' : 'Reply'}
                </button>
            </div>
            {remaining <= 80 && (
                <p aria-live="polite" className="t-readout mt-2 text-rule-strong">
                    {remaining} characters left
                </p>
            )}
        </form>
    );
};

export default ReplyInput;
