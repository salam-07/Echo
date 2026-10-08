import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import { Measure, Notice, Placeholder, Coda } from '../components/editorial/Apparatus';
import { useEchoStore } from '../store/useEchoStore';

const ORDERS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'likes', label: 'Most liked' },
];

const WINDOWS = [
    { value: 'all', label: 'All time' },
    { value: '1hour', label: 'Last hour' },
    { value: '1day', label: 'Last day' },
    { value: '1week', label: 'Last week' },
    { value: '1month', label: 'Last month' },
    { value: '1year', label: 'Last year' },
];


const TagsPage = () => {
    const { tagName } = useParams();
    const { echos, isLoadingEchos, getEchosByTag } = useEchoStore();

    const [orderBy, setOrderBy] = useState('newest');
    const [timeframe, setTimeframe] = useState('all');

    useEffect(() => {
        if (tagName) getEchosByTag(tagName, orderBy, timeframe);
    }, [tagName, orderBy, timeframe, getEchosByTag]);

    return (
        <Layout>
            <Measure>
                <header className="pt-10 pb-6 sm:pt-12">
                    <h1 className="t-page-title text-ink">
                        <span className="text-ink-quiet">#</span>{tagName}
                    </h1>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <p className="t-readout text-ink-quiet" role="status">
                            {isLoadingEchos ? 'Loading Echos…' : `${echos?.length ?? 0} ${echos?.length === 1 ? 'Echo' : 'Echos'} shown`}
                        </p>
                        <Link to="/browse/tags" className="link-rule inline-flex min-h-11 items-center text-[0.8125rem] text-ink-quiet">
                            Explore tags
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <fieldset>
                            <legend className="t-label">Sort by</legend>
                            <div className="mt-1 flex border border-rule">
                                {ORDERS.map((option, index) => (
                                    <label
                                        key={option.value}
                                        data-held={orderBy === option.value || undefined}
                                        className={`stop t-label h-11 flex-1 whitespace-nowrap px-3 ${
                                            index > 0 ? 'border-l border-rule' : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tagOrder"
                                            className="sr-only"
                                            checked={orderBy === option.value}
                                            onChange={() => setOrderBy(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div>
                            <label htmlFor="tag-window" className="t-label block">
                                Posted
                            </label>
                            <select
                                id="tag-window"
                                value={timeframe}
                                onChange={(event) => setTimeframe(event.target.value)}
                                className="field field-sm mt-1"
                            >
                                {WINDOWS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                {isLoadingEchos && (!echos || echos.length === 0) ? (
                    <Placeholder rows={4} />
                ) : !echos || echos.length === 0 ? (
                    <Notice
                        statement={timeframe === 'all' ? 'Be the first voice here.' : 'No Echos in this time range.'}
                        note={timeframe === 'all' ? 'Post an Echo to start the conversation.' : 'Try all time to see more Echos.'}
                        actions={
                            <>
                                {timeframe !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() => setTimeframe('all')}
                                        className="act act-outline h-11 px-6"
                                    >
                                        Show all time
                                    </button>
                                )}
                                <Link to={`/new?tag=${encodeURIComponent(tagName)}`} className={`act h-11 px-6 ${timeframe === 'all' ? '' : 'act-quiet'}`}>
                                    Post an Echo
                                </Link>
                            </>
                        }
                    />
                ) : (
                    <div className="pb-8">
                        {echos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                        <Coda label="End of Echos" />
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default TagsPage;
