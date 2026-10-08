import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import useAuthStore from '../store/useAuthStore';
import { ScrollGroup, SCROLL_RAIL } from '../components/features/scroll';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../components/editorial/Apparatus';

const ScrollsPage = () => {
    const { scrolls, isLoadingScrolls, scrollsError, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const { owned, followed } = useMemo(
        () => ({
            owned: scrolls.filter((scroll) => scroll.creator?._id === authUser?._id),
            followed: scrolls.filter((scroll) => scroll.creator?._id !== authUser?._id),
        }),
        [scrolls, authUser?._id],
    );

    const handleDelete = async (scroll) => {
        if (window.confirm(`Delete "${scroll.name}"? This cannot be undone.`)) {
            await deleteScroll(scroll._id);
        }
    };

    const deleteAction = (scroll) => (
        <button
            type="button"
            onClick={() => handleDelete(scroll)}
            disabled={isDeletingScroll}
            className="t-label min-h-11 text-ink-quiet transition-colors hover:text-alarm disabled:opacity-40"
        >
            Delete
        </button>
    );

    return (
        <Layout>
            <Measure>
                <SheetHead
                    subject="Your Scrolls"
                    deck="Feeds and Curations you create or follow."
                    actions={scrolls.length > 0 && (
                        <Link to="/scroll/new" className="act h-11 px-6">
                            Create a Scroll
                        </Link>
                    )}
                >
                    <Rail quiet items={SCROLL_RAIL} className="mt-8" />
                </SheetHead>

                {scrollsError && scrolls.length === 0 ? (
                <Notice statement="Couldn’t load your Scrolls." note="Try again to bring your library back."
                    actions={<button type="button" onClick={() => getScrolls()} className="act h-11 px-6">Try again</button>} />
            ) : isLoadingScrolls && scrolls.length === 0 ? (
                    <Placeholder rows={4} />
                ) : scrolls.length === 0 ? (
                    <Notice
                        statement="Make room for what matters."
                        note="Create a Feed that finds Echos for you, or a Curation to collect your favorites."
                        actions={
                            <>
                                <Link to="/scroll/new" className="act h-11 px-6">
                                    Create a Scroll
                                </Link>
                                <Link to="/community" className="act act-outline h-11 px-6">
                                    Explore Community
                                </Link>
                            </>
                        }
                    />
                ) : (
                    <div className="pb-16">
                        <ScrollGroup label="Yours" count={owned.length} items={owned} renderAction={deleteAction} />
                        <ScrollGroup label="Following" count={followed.length} items={followed} />

                        <Link
                            to="/community"
                            className="t-label mt-8 flex min-h-11 items-center text-ink-quiet transition-colors hover:text-ink"
                        >
                            <span>Explore Community</span>

                        </Link>
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default ScrollsPage;
