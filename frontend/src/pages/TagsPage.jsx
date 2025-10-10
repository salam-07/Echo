import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Hash } from 'lucide-react';
import Layout from '../layouts/Layout';
import EchoCard from '../components/EchoCard';
import { useEchoStore } from '../store/useEchoStore';

const TagsPage = () => {
    const { tagName } = useParams();
    const navigate = useNavigate();
    const { echos, isLoadingEchos, getEchosByTag } = useEchoStore();

    const [orderBy, setOrderBy] = useState('newest');
    const [timeframe, setTimeframe] = useState('all');

    useEffect(() => {
        if (tagName) {
            getEchosByTag(tagName, orderBy, timeframe);
        }
    }, [tagName, orderBy, timeframe, getEchosByTag]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleOrderChange = (newOrder) => {
        setOrderBy(newOrder);
    };

    const handleTimeframeChange = (newTimeframe) => {
        setTimeframe(newTimeframe);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-3 sm:p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-base-content" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Hash className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-semibold text-base-content">
                            {tagName}
                        </h1>
                    </div>
                </div>

                {/* Sorting Controls */}
                <div className="flex gap-3 mb-6">
                    <button className="btn btn-sm btn-ghost"
                        popoverTarget="order-popover"
                        style={{ anchorName: "--order-anchor" }}>
                        {orderBy === 'newest' ? 'Newest First' : orderBy === 'oldest' ? 'Oldest First' : 'Most Liked'}
                        <ChevronDown />
                    </button>

                    <ul className="dropdown menu w-44 rounded-box bg-base-100 shadow-sm"
                        popover="auto"
                        id="order-popover"
                        style={{ positionAnchor: "--order-anchor" }}>
                        <li><a onClick={() => handleOrderChange('newest')}>Newest First</a></li>
                        <li><a onClick={() => handleOrderChange('oldest')}>Oldest First</a></li>
                        <li><a onClick={() => handleOrderChange('likes')}>Most Liked</a></li>
                    </ul>

                    <button className="btn btn-sm btn-ghost"
                        popoverTarget="time-popover"
                        style={{ anchorName: "--time-anchor" }}>
                        {timeframe === 'all' ? 'All Time' :
                            timeframe === '1hour' ? 'Last Hour' :
                                timeframe === '1day' ? 'Last Day' :
                                    timeframe === '1week' ? 'Last Week' :
                                        timeframe === '1month' ? 'Last Month' : 'Last Year'}
                        <ChevronDown />
                    </button>

                    <ul className="dropdown menu w-44 rounded-box bg-base-100 shadow-sm"
                        popover="auto"
                        id="time-popover"
                        style={{ positionAnchor: "--time-anchor" }}>
                        <li><a onClick={() => handleTimeframeChange('all')}>All Time</a></li>
                        <li><a onClick={() => handleTimeframeChange('1hour')}>Last Hour</a></li>
                        <li><a onClick={() => handleTimeframeChange('1day')}>Last Day</a></li>
                        <li><a onClick={() => handleTimeframeChange('1week')}>Last Week</a></li>
                        <li><a onClick={() => handleTimeframeChange('1month')}>Last Month</a></li>
                        <li><a onClick={() => handleTimeframeChange('1year')}>Last Year</a></li>
                    </ul>
                </div>

                {/* Content */}
                {isLoadingEchos ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-base-100 border border-base-300 rounded-lg p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-4 bg-base-300 rounded w-24"></div>
                                    <div className="h-3 bg-base-300 rounded w-12"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-base-300 rounded w-full"></div>
                                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : echos && echos.length > 0 ? (
                    <div className="space-y-0">
                        {echos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Hash className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-base-content mb-2">
                            No echos found
                        </h3>
                        <p className="text-base-content/60">
                            No one has posted with #{tagName} yet.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TagsPage;