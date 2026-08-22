import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import useCommunityStore from '../store/useCommunityStore';
import EchoCard from '../components/features/echo/EchoCard';
import { COMMUNITY_RAIL } from '../components/features/browse';
import { Measure, SheetHead, Notice, Placeholder, Coda, Rail } from '../components/editorial/Apparatus';

/**
 * The most-liked register, in order.
 *
 * The old page had four time-range pills — Today, This Week, This Month, All Time —
 * none of which reached the request; the endpoint takes a limit and nothing else.
 * A control that cannot change the answer is worse than no control, so it is gone.
 * The order is the ranking, and each entry prints its own count.
 */
const PopularEchosPage = () => {
    const { popularEchos, isLoadingPopularEchos, fetchPopularEchos } = useCommunityStore();

    useEffect(() => {
        fetchPopularEchos();
    }, [fetchPopularEchos]);

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Most liked"
                    subject="What has travelled furthest."
                    readout={popularEchos.length ? `${popularEchos.length} entries` : undefined}
                    deck="Every echo here, in order of how many people have marked it. Read down."
                >
                    <Rail items={COMMUNITY_RAIL} className="mt-8" />
                </SheetHead>

                {isLoadingPopularEchos && popularEchos.length === 0 ? (
                    <Placeholder rows={5} />
                ) : popularEchos.length === 0 ? (
                    <Notice
                        statement="Nothing has been liked yet."
                        note="The first echo somebody marks will stand at the top of this sheet."
                        actions={
                            <Link to="/new" className="act act-outline h-11 px-6">
                                Write an echo
                            </Link>
                        }
                    />
                ) : (
                    <div className="border-t border-ink">
                        {popularEchos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                        <Coda />
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default PopularEchosPage;
