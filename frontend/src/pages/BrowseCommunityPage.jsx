import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import useCommunityStore from '../store/useCommunityStore';
import { ScrollCard } from '../components/features/scroll';
import { TagRow, COMMUNITY_RAIL } from '../components/features/browse';
import { Measure, SheetHead, Section, Placeholder, Rail } from '../components/editorial/Apparatus';

/** Nothing to show under a heading yet — one line, in the margin's voice. */
const Nothing = ({ children }) => <p className="t-readout py-8 text-rule-strong">{children}</p>;

/**
 * The community sheet: a contents page for everything other people have made.
 *
 * Each division shows the first few and then points at the whole register. The old
 * page put Feeds and Curations in two-across tiles, which meant a name, a byline
 * and a description competing inside a 240px box; here they are the same records
 * the Scrolls register prints, so a Scroll looks like a Scroll everywhere.
 */
const BrowseCommunityPage = () => {
    const {
        feedScrolls,
        curationScrolls,
        tags,
        isLoadingFeeds,
        isLoadingCurations,
        isLoadingTags,
        fetchPublicFeedScrolls,
        fetchPublicCurationScrolls,
        fetchTags,
    } = useCommunityStore();

    useEffect(() => {
        fetchPublicFeedScrolls(4);
        fetchPublicCurationScrolls(4);
        fetchTags(12);
    }, [fetchPublicFeedScrolls, fetchPublicCurationScrolls, fetchTags]);

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Community"
                    subject="What everybody else is reading by."
                    deck="Rules, shelves and tags. Follow anything here and it joins your index."
                >
                    <Rail items={COMMUNITY_RAIL} className="mt-8" />
                </SheetHead>

                <Section label="Feeds" to="/browse/scrolls">
                    {isLoadingFeeds && feedScrolls.length === 0 ? (
                        <Placeholder rows={2} />
                    ) : feedScrolls.length === 0 ? (
                        <Nothing>No public Feeds yet.</Nothing>
                    ) : (
                        feedScrolls.map((scroll) => <ScrollCard key={scroll._id} scroll={scroll} />)
                    )}
                </Section>

                <Section label="Curations" to="/browse/curation">
                    {isLoadingCurations && curationScrolls.length === 0 ? (
                        <Placeholder rows={2} />
                    ) : curationScrolls.length === 0 ? (
                        <Nothing>No public Curations yet.</Nothing>
                    ) : (
                        curationScrolls.map((scroll) => <ScrollCard key={scroll._id} scroll={scroll} />)
                    )}
                </Section>

                <Section label="Tags" to="/browse/tags">
                    {isLoadingTags && tags.length === 0 ? (
                        <Placeholder rows={2} />
                    ) : tags.length === 0 ? (
                        <Nothing>No tags yet.</Nothing>
                    ) : (
                        <div className="sm:grid sm:grid-cols-2 sm:gap-x-10">
                            {tags.slice(0, 12).map((tag) => (
                                <TagRow key={tag._id} tag={tag} />
                            ))}
                        </div>
                    )}
                </Section>

                <Link
                    to="/search"
                    className="t-label mb-16 flex h-14 items-center justify-between border-b border-rule text-rule-strong transition-colors hover:text-ink"
                >
                    <span>Looking for something in particular?</span>
                    <span aria-hidden="true">↗</span>
                </Link>
            </Measure>
        </Layout>
    );
};

export default BrowseCommunityPage;
