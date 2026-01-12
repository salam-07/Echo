import React from 'react';
import { UserLink, Timestamp } from '../../ui';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const ReplyList = ({ replies, onDeleteReply }) => {
    const { authUser } = useAuthStore();

    if (!replies || replies.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-xs text-base-content/30">No replies yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {replies.map((reply) => (
                <div key={reply._id} className="py-3 border-b border-base-200/30 last:border-0 group">
                    {/* Reply header */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <UserLink
                            user={reply.user}
                            showPrefix={true}
                            className="text-[13px] font-medium text-base-content/60"
                        />
                        <span className="text-xs text-base-content/20">·</span>
                        <Timestamp
                            date={reply.createdAt}
                            className="text-xs text-base-content/30"
                        />

                        {/* Delete button - only show for reply author */}
                        {authUser?._id === reply.user?._id && onDeleteReply && (
                            <button
                                onClick={() => onDeleteReply(reply._id)}
                                className="ml-auto text-base-content/20 hover:text-red-400 p-1 transition-colors"
                                title="Delete reply"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-base-content/80 whitespace-pre-wrap break-words leading-relaxed">
                        {reply.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReplyList;
