import React from 'react';
import { UserLink, Timestamp } from '../../ui';
import useAuthStore from '../../../store/useAuthStore';

/**
 * Replies, ruled one under another. Your own reply is the only one with `Delete`
 * beside it, and that word is always printed rather than revealed on hover — a
 * control you can only find by pointing at it does not exist on a touch screen.
 */
const ReplyList = ({ replies, onDeleteReply }) => {
    const { authUser } = useAuthStore();

    if (!replies || replies.length === 0) {
        return <p className="t-body py-8 text-ink-quiet">No replies yet.</p>;
    }

    return (
        <ul>
            {replies.map((reply) => (
                <li key={reply._id} className="border-b border-rule py-5 last:border-b-0">
                    <div className="flex items-baseline gap-3">
                        <UserLink user={reply.user} />
                        <Timestamp date={reply.createdAt} className="t-readout text-rule-strong" />
                        {authUser?._id === reply.user?._id && onDeleteReply && (
                            <button
                                type="button"
                                onClick={() => onDeleteReply(reply._id)}
                                className="t-label ml-auto shrink-0 py-1 text-[0.625rem] transition-colors hover:text-alarm"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-[0.9375rem] leading-[1.55] text-ink-soft">
                        {reply.comment}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default ReplyList;
