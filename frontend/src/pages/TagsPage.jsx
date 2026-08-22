import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import { Measure, SheetHead, Notice, Placeholder, Coda } from '../components/editorial/Apparatus';
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

/**
 * Everything filed under one tag.
 *
 * Order is a rail — three stops, one held. The window is a select, because six
 * options is a menu and not an either/or, and a six-stop rail on a phone is a
 * wrapped mess. Both replace anchored popovers whose menus were unlabelled lists
 * of anchor tags.
 */
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
                <SheetHead
                    label="Tag"
                    subject={`#${tagName}`}
                    readout={echos?.length ? `${echos.length} shown` : undefined}
                >
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <fieldset>
                            <legend className="t-label">Order</legend>
                            <div className="mt-1 flex border border-rule">
                                {ORDERS.map((option, index) => (
                                    <label
                                        key={option.value}
                                        data-held={orderBy === option.value || undefined}
                                        className={`stop t-label h-10 flex-1 whitespace-nowrap px-3 ${
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
                                Written within
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
                </SheetHead>

                {isLoadingEchos && (!echos || echos.length === 0) ? (
                    <Placeholder rows={4} />
                ) : !echos || echos.length === 0 ? (
                    <Notice
                        statement={`Nothing is filed under #${tagName} in this window.`}
                        note="Widen the window, or write the first one yourself."
                        actions={
                            <>
                                {timeframe !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() => setTimeframe('all')}
                                        className="act act-outline h-11 px-6"
                                    >
                                        Open it to all time
                                    </button>
                                )}
                                <Link to="/new" className="act act-quiet h-11 px-6">
                                    Write an echo
                                </Link>
                            </>
                        }
                    />
                ) : (
                    <div className="border-t border-ink">
                        {echos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                        <Coda />
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default TagsPage;
