import React from 'react';
import { Link } from 'react-router-dom';
import { UserLink } from '../../ui';
import useAuthStore from '../../../store/useAuthStore';
import FollowButton from './FollowButton';

/**
 * A Scroll, printed as a record rather than a card in a grid. Name, kind, whose it
 * is, and — for a Feed — the first few terms of the rule that fills it, so the row
 * says what the Scroll *does* and not merely that it exists.
 *
 * The kind comes off the record (`scroll.type`), not from a prop. A row that has to
 * be told what it is showing is a row that can be told wrong.
 *
 * No count is printed unless it is stored: a Feed has no fixed number of entries,
 * so it does not claim one.
 */
const ScrollCard = ({ scroll, compact = false, action = null }) => {
    const { authUser } = useAuthStore();
    const isFeed = scroll.type === 'feed';
    const isMine = scroll.creator?._id === authUser?._id;
    const tags = scroll.feedConfig?.includedTags ?? [];
    const authors = scroll.feedConfig?.authors ?? [];
    const followers = scroll.savedBy?.length ?? 0;

    return (
        <article className="border-b border-rule py-5">
            <div className="flex items-baseline justify-between gap-5">
                <h3 className={compact ? 'min-w-0 text-[0.9375rem] font-medium' : 'min-w-0 t-subject'}>
                    <Link to={`/scroll/${scroll._id}`} className="link-rule text-ink">
                        {scroll.name}
                    </Link>
                </h3>
                <div className="flex shrink-0 items-center gap-4">
                    {action}
                    <FollowButton scroll={scroll} size="xs" />
                </div>
            </div>

            <p className="t-readout mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-rule-strong">
                <span className="t-label text-[0.625rem]">{isFeed ? 'Feed' : 'Curation'}</span>
                {scroll.isPrivate && <span className="t-label text-[0.625rem]">Private</span>}
                {!isMine && (
                    <span className="flex items-baseline gap-1">
                        by <UserLink user={scroll.creator} className="text-[0.75rem] font-medium text-ink-quiet" />
                    </span>
                )}
                {!isFeed && <span>{scroll.echos?.length ?? 0} entries</span>}
                <span>
                    {followers} {followers === 1 ? 'follower' : 'followers'}
                </span>
            </p>

            {scroll.description && (
                <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-[1.55] text-ink-soft">
                    {scroll.description}
                </p>
            )}

            {isFeed && (tags.length > 0 || authors.length > 0) && (
                <p className="t-readout mt-3 flex flex-wrap gap-x-3 gap-y-1 text-rule-strong">
                    {tags.slice(0, 3).map((tag) => (
                        <span key={tag._id}>#{tag.name}</span>
                    ))}
                    {tags.length > 3 && <span>+{tags.length - 3} more tags</span>}
                    {authors.slice(0, 2).map((author) => (
                        <span key={author._id}>@{author.userName}</span>
                    ))}
                    {authors.length > 2 && <span>+{authors.length - 2} more authors</span>}
                </p>
            )}
        </article>
    );
};

export default ScrollCard;
