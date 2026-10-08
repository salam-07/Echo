import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import useCommunityStore from '../store/useCommunityStore';
import { ScrollCard } from '../components/features/scroll';
import { TagRow, COMMUNITY_RAIL } from '../components/features/browse';
import { Measure, SheetHead, Section, Placeholder, Rail } from '../components/editorial/Apparatus';

const Nothing = ({ children }) => <p className="t-readout py-8 text-ink-quiet">{children}</p>;

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
                    subject="Community"
                    deck="Find your next good read. Follow a Scroll to keep it in your library."
                >
                    <Rail quiet items={COMMUNITY_RAIL} className="mt-8" />
                </SheetHead>

                <Section ruled={false} label="Feeds" to="/browse/scrolls">
                    {isLoadingFeeds && feedScrolls.length === 0 ? (
                        <Placeholder rows={2} />
                    ) : feedScrolls.length === 0 ? (
                        <Nothing>No public Feeds yet.</Nothing>
                    ) : (
                        feedScrolls.map((scroll) => <ScrollCard key={scroll._id} scroll={scroll} showKind={false} />)
                    )}
                </Section>

                <Section ruled={false} label="Curations" to="/browse/curation">
                    {isLoadingCurations && curationScrolls.length === 0 ? (
                        <Placeholder rows={2} />
                    ) : curationScrolls.length === 0 ? (
                        <Nothing>No public Curations yet.</Nothing>
                    ) : (
                        curationScrolls.map((scroll) => <ScrollCard key={scroll._id} scroll={scroll} showKind={false} />)
                    )}
                </Section>

                <Section ruled={false} label="Tags" to="/browse/tags">
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
                    className="t-label mt-8 mb-16 flex min-h-11 items-center text-ink-quiet transition-colors hover:text-ink"
                >
                    <span>Search Echos, Scrolls and people</span>

                </Link>
            </Measure>
        </Layout>
    );
};

export default BrowseCommunityPage;
