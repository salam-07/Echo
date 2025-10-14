import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const UserLink = ({
    user,
    className = 'text-sm font-medium text-base-content hover:text-base-content/70 transition-colors',
    prefix = '@',
    showPrefix = true,
    ...props
}) => {
    const displayName = user?.userName || 'Anonymous';
    const userId = user?._id;

    if (!userId) {
        return (
            <span className={cn(className, 'cursor-default')} {...props}>
                {showPrefix && prefix}{displayName}
            </span>
        );
    }

    return (
        <Link
            to={`/user/${userId}`}
            className={className}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {showPrefix && prefix}{displayName}
        </Link>
    );
};

export default UserLink;