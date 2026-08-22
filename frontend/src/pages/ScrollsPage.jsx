import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import useAuthStore from '../store/useAuthStore';
import { ScrollCard, SCROLL_RAIL } from '../components/features/scroll';
import { Measure, SheetHead, Notice, Placeholder, Rail } from '../components/editorial/Apparatus';

/**
 * The register of Scrolls — yours first, then the ones you follow.
 *
 * The old page put every group in a rounded panel with an icon plate per row, which
 * meant four levels of container before you reached a name. Here a group is a ruled
 * heading and the rows beneath it, which is what a register is.
 */
const ScrollsPage = () => {
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
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

    const Group = ({ label, count, items, deletable = false }) =>
        items.length === 0 ? null : (
            <section className="mt-12">
                <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-3">
                    <h2 className="t-label t-label--ink">{label}</h2>
                    <p className="t-readout text-ink-quiet">{count}</p>
                </div>
                {items.map((scroll) => (
                    <ScrollCard
                        key={scroll._id}
                        scroll={scroll}
                        action={
                            deletable ? (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(scroll)}
                                    disabled={isDeletingScroll}
                                    className="t-label h-9 text-rule-strong transition-colors hover:text-alarm disabled:opacity-40"
                                >
                                    Delete
                                </button>
                            ) : null
                        }
                    />
                ))}
            </section>
        );

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Scrolls"
                    subject="Everything you read by."
                    readout={`${scrolls.length} in all`}
                    deck="A Feed is a rule that fills itself. A Curation is a shelf you fill by hand."
                    actions={
                        <Link to="/scroll/new" className="act h-11 px-6">
                            New scroll
                        </Link>
                    }
                >
                    <Rail items={SCROLL_RAIL} className="mt-8" />
                </SheetHead>

                {isLoadingScrolls && scrolls.length === 0 ? (
                    <Placeholder rows={4} />
                ) : scrolls.length === 0 ? (
                    <Notice
                        statement="You have no Scrolls yet."
                        note="Write a rule and your feed fills itself, or start a Curation and file echoes into it by hand."
                        actions={
                            <>
                                <Link to="/scroll/new" className="act h-11 px-6">
                                    New scroll
                                </Link>
                                <Link to="/community" className="act act-outline h-11 px-6">
                                    See what others read
                                </Link>
                            </>
                        }
                    />
                ) : (
                    <div className="pb-16">
                        <Group label="Yours" count={owned.length} items={owned} deletable />
                        <Group label="Following" count={followed.length} items={followed} />

                        <Link
                            to="/community"
                            className="t-label mt-12 flex h-14 items-center justify-between border-t border-rule text-rule-strong transition-colors hover:text-ink"
                        >
                            <span>More Scrolls from the community</span>
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default ScrollsPage;
