import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * A byline. The `@` stays, because it is how the product names people, and the
 * hairline under it on hover is the same underline the whole document uses for a
 * link.
 */
const UserLink = ({
    user,
    className = 'text-[0.875rem] font-medium tracking-[0.01em] text-ink',
    prefix = '@',
    showPrefix = true,
    ...props
}) => {
    const displayName = user?.userName || 'Anonymous';
    const userId = user?._id;

    if (!userId) {
        return (
            <span className={cn(className, 'cursor-default text-ink-quiet')} {...props}>
                {showPrefix && prefix}
                {displayName}
            </span>
        );
    }

    return (
        <Link
            to={`/user/${userId}`}
            className={cn(className, 'link-rule')}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {showPrefix && prefix}
            {displayName}
        </Link>
    );
};

export default UserLink;
