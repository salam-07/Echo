import React from 'react';
import { UserLink, Timestamp } from '../../ui';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const ReplyList = ({ replies, onDeleteReply }) => {
    const { authUser } = useAuthStore();

    if (!replies || replies.length === 0) {
        return (
            <div className="text-center py-8 text-base-content/50">
                <p className="text-sm">No replies yet. Be the first to reply!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {replies.map((reply) => (
                <div key={reply._id} className="flex gap-3 group">
                    {/* User avatar placeholder */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                            {reply.user?.userName?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>

                    {/* Reply content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <UserLink
                                user={reply.user}
                                showPrefix={true}
                                className="text-sm font-medium"
                            />
                            <span className="text-xs text-base-content/40">·</span>
                            <Timestamp
                                date={reply.createdAt}
                                className="text-xs text-base-content/40"
                            />

                            {/* Delete button - only show for reply author */}
                            {authUser?._id === reply.user?._id && onDeleteReply && (
                                <button
                                    onClick={() => onDeleteReply(reply._id)}
                                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-base-content/40 hover:text-red-500 p-1"
                                    title="Delete reply"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-base-content/80 whitespace-pre-wrap break-words">
                            {reply.comment}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReplyList;
