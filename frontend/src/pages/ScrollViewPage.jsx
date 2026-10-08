import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard } from '../components/features/echo';
import { FollowButton } from '../components/features/scroll';
import { UserLink } from '../components/ui';
import { Measure, SheetHead, Notice, Placeholder, Coda } from '../components/editorial/Apparatus';
import { useScrollStore } from '../store/useScrollStore';
import useAuthStore from '../store/useAuthStore';

const ORDER = { newestFirst: 'Newest first', oldestFirst: 'Oldest first', mostLiked: 'Most liked' };
const WINDOW = { '1day': 'the last 24 hours', '1month': 'the last month', '1year': 'the last year', allTime: 'all time' };

/** One line of the rule's colophon: the term named, then what it is set to. */
const Term = ({ name, children }) => (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
        <dt className="t-label w-40 shrink-0">{name}</dt>
        <dd className="t-readout text-ink">{children}</dd>
    </div>
);

/**
 * A Scroll, opened. A Feed prints its rule above its output — the terms as a
 * colophon — so you can read what produced the column you are looking at, and
 * a Curation prints how many entries it holds, because it holds a fixed number.
 */
const ScrollViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        scroll,
        scrollEchos,
        isLoadingScroll,
        isLoadingScrollEchos,
        getScrollById,
        getScrollEchos,
        deleteScroll,
        isDeletingScroll,
    } = useScrollStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        if (id) {
            getScrollById(id);
            getScrollEchos(id);
        }
    }, [id, getScrollById, getScrollEchos]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${scroll?.name}"? This cannot be undone.`)) return;
        try {
            await deleteScroll(id);
            navigate('/scrolls');
        } catch (error) {
            console.log('Error deleting scroll:', error);
        }
    };

    if (isLoadingScroll || !scroll) {
        return (
            <Layout>
                <Measure>
                    <SheetHead label="Scroll" />
                    {isLoadingScroll ? (
                        <Placeholder rows={3} />
                    ) : (
                        <Notice
                            statement="This Scroll is no longer here."
                            note="It may have been deleted, or it may be private."
                            actions={
                                <Link to="/scrolls" className="act act-outline h-11 px-6">
                                    Back to your Scrolls
                                </Link>
                            }
                        />
                    )}
                </Measure>
            </Layout>
        );
    }

    const isOwner = scroll.creator?._id === authUser?._id;
    const isFeed = scroll.type === 'feed';
    const rule = scroll.feedConfig ?? {};
    const included = rule.includedTags ?? [];
    const excluded = rule.excludedTags ?? [];
    const authors = rule.authors ?? [];
    const followers = scroll.savedBy?.length ?? 0;

    return (
        <Layout>
            <Measure>
                <SheetHead
                    display
                    subject={scroll.name}
                    deck={scroll.description || undefined}
                    actions={
                        <>
                            <FollowButton scroll={scroll} size="md" />
                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeletingScroll}
                                    className="act act-quiet h-10 px-4 hover:text-alarm disabled:opacity-40"
                                >
                                    Delete
                                </button>
                            )}
                        </>
                    }
                >
                    <p className="t-readout mt-4 flex flex-wrap items-baseline gap-x-3 text-ink-quiet">
                            <span>{isFeed ? 'Feed' : 'Curation'}</span>
                            {followers > 0 && <span>{followers} {followers === 1 ? 'follower' : 'followers'}</span>}
                            {!isOwner && scroll.creator?.userName && (
                                <span className="flex items-baseline gap-1">
                                    By{' '}
                                    <UserLink
                                        user={scroll.creator}
                                        className="text-[0.75rem] font-medium text-ink-quiet"
                                    />
                                </span>
                            )}
                            {!isFeed && <span>{scroll.echos?.length ?? 0} {scroll.echos?.length === 1 ? 'Echo' : 'Echos'}</span>}
                            {scroll.isPrivate && <span>Private</span>}
                    </p>
                </SheetHead>

                {isFeed && (
                    <details className="mb-6">
                        <summary className="t-label cursor-pointer py-3 text-ink">Feed filters</summary>
                        <dl>
                        <Term name="Order">
                            {ORDER[rule.sortBy] ?? 'Newest first'}
                            {rule.sortBy === 'mostLiked' && ` of ${WINDOW[rule.sortTimeRange] ?? 'all time'}`}
                        </Term>
                        {included.length > 0 && (
                            <Term name={rule.tagMatchType === 'all' ? 'All of these tags' : 'Any of these tags'}>
                                {included.map((tag) => `#${tag.name}`).join(' · ')}
                            </Term>
                        )}
                        {excluded.length > 0 && (
                            <Term name="Exclude tags">{excluded.map((tag) => `#${tag.name}`).join(' · ')}</Term>
                        )}
                        {authors.length > 0 && (
                            <Term name="Only from">{authors.map((author) => `@${author.userName}`).join(' · ')}</Term>
                        )}
                        {rule.excludeLikedEchos && <Term name="Leaves out">Echos you have already liked</Term>}
                    </dl>
                    </details>
                )}

                {isLoadingScrollEchos && scrollEchos.length === 0 ? (
                    <Placeholder rows={4} />
                ) : scrollEchos.length === 0 ? (
                    <Notice
                        statement={isFeed ? 'No matching Echos yet.' : 'This collection is waiting for its first Echo.'}
                        note={
                            isFeed
                                ? 'New Echos appear here when they match this Feed’s filters.'
                                : 'Use Save on any Echo to add it to a Curation you own.'
                        }
                        actions={
                            <Link to="/" className="act act-outline h-11 px-6">
                                Back to the feed
                            </Link>
                        }
                    />
                ) : (
                    <div className="pb-8">
                        {scrollEchos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                        <Coda label="End of list" />
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default ScrollViewPage;
