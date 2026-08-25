import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import { ScrollCard } from '../components/features/scroll';
import { Avatar } from '../components/ui';
import useAuthStore from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { Measure, SheetHead, Notice, Placeholder, Coda, More } from '../components/editorial/Apparatus';

const REGISTERS = [
    { value: 'echos', label: 'Echos' },
    { value: 'scrolls', label: 'Scrolls' },
];

/** A counted quantity in the masthead. The numeral leads; the word explains it. */
const Count = ({ value, label }) => (
    <div>
        <p className="font-display text-[1.75rem] leading-none tracking-[-0.01em] text-ink">{value}</p>
        <p className="t-label mt-2">{label}</p>
    </div>
);

/**
 * A person's own sheet: the masthead, then everything they have written or built.
 *
 * This is the one screen where the square plate appears — a name at masthead scale
 * wants a mark beside it, and here the name is the subject of the page rather than
 * a byline inside a row. The old page set the username at 72px and put a Follow
 * button beside it that only wrote to the console; there is no endpoint behind
 * following a person, so the button is gone rather than pretending.
 *
 * Counts come from the paginated totals, not from `list.length`, which only ever
 * knew about the first ten.
 */
const UserPage = () => {
    const { id } = useParams();
    const { authUser } = useAuthStore();
    const [register, setRegister] = useState('echos');

    const {
        profile,
        myProfile,
        userEchos,
        userScrolls,
        echosPagination,
        scrollsPagination,
        isLoadingProfile,
        isLoadingMyProfile,
        isLoadingUserEchos,
        isLoadingUserScrolls,
        getProfile,
        getMyProfile,
        getUserEchos,
        getUserScrolls,
        loadMoreEchos,
        loadMoreScrolls,
        clearProfile,
    } = useProfileStore();

    const isOwn = !id || id === authUser?._id;
    const userId = isOwn ? authUser?._id : id;

    useEffect(() => {
        if (!userId) return;
        if (isOwn) getMyProfile();
        else getProfile(userId);
        getUserEchos(userId);
        getUserScrolls(userId, 'created');
        return () => clearProfile();
    }, [userId, isOwn, getMyProfile, getProfile, getUserEchos, getUserScrolls, clearProfile]);

    const person = isOwn ? myProfile || authUser : profile;
    const isLoading = isOwn ? isLoadingMyProfile : isLoadingProfile;

    if (isLoading && !person) {
        return (
            <Layout>
                <Measure>
                    <SheetHead label="Account" />
                    <Placeholder rows={3} />
                </Measure>
            </Layout>
        );
    }

    if (!person) {
        return (
            <Layout>
                <Measure>
                    <SheetHead label="Account" subject="No such account." />
                    <Notice
                        statement="This name is not in the record."
                        note="It may have been closed, or the address may be wrong."
                        actions={
                            <Link to="/search/users" className="act act-outline h-11 px-6">
                                Search for a name
                            </Link>
                        }
                    />
                </Measure>
            </Layout>
        );
    }

    const echoCount = echosPagination?.totalEchos ?? userEchos.length;
    const scrollCount = scrollsPagination?.totalScrolls ?? userScrolls.length;
    const joined = person.createdAt
        ? new Date(person.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    const rail = REGISTERS.map((item) => ({
        ...item,
        count: item.value === 'echos' ? echoCount : scrollCount,
    }));

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label={isOwn ? 'Your account' : 'Account'}
                    readout={joined ? `Writing since ${joined}` : undefined}
                >
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <Avatar size="lg" fallback={person.userName?.charAt(0)?.toUpperCase() || '?'} />
                            <h1 className="t-subject min-w-0 break-all">@{person.userName}</h1>
                        </div>
                        {isOwn && (
                            <Link to="/settings" className="act act-outline h-10 shrink-0 px-5">
                                Settings
                            </Link>
                        )}
                    </div>

                    {person.bio && <p className="t-body mt-4 max-w-[52ch] text-ink-soft">{person.bio}</p>}

                    <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6 border-t border-rule pt-6">
                        <Count value={echoCount} label="Echos" />
                        <Count value={scrollCount} label="Scrolls" />
                    </div>

                    <fieldset className="mt-8">
                        <legend className="sr-only">Which register to read</legend>
                        <div className="flex border border-rule">
                            {rail.map((item, index) => (
                                <label
                                    key={item.value}
                                    data-held={register === item.value || undefined}
                                    className={`stop t-label h-11 flex-1 gap-2 whitespace-nowrap px-4 ${
                                        index > 0 ? 'border-l border-rule' : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="register"
                                        className="sr-only"
                                        checked={register === item.value}
                                        onChange={() => setRegister(item.value)}
                                    />
                                    {item.label} <span aria-hidden="true">{item.count}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </SheetHead>

                {register === 'echos' ? (
                    isLoadingUserEchos && userEchos.length === 0 ? (
                        <Placeholder rows={3} />
                    ) : userEchos.length === 0 ? (
                        <Notice
                            statement={isOwn ? 'You have not written anything yet.' : `@${person.userName} has not written anything yet.`}
                            note={
                                isOwn
                                    ? 'An echo is at most a thousand characters. That is the whole form.'
                                    : 'When they do, it will appear here in order.'
                            }
                            actions={
                                isOwn ? (
                                    <Link to="/new" className="act h-11 px-6">
                                        Write your first echo
                                    </Link>
                                ) : null
                            }
                        />
                    ) : (
                        <div key="echos" className="animate-set-in border-t border-ink">
                            {userEchos.map((echo) => (
                                <EchoCard key={echo._id} echo={echo} />
                            ))}
                            {echosPagination?.hasNext ? (
                                <More
                                    shown={userEchos.length}
                                    total={echoCount}
                                    isLoading={isLoadingUserEchos}
                                    onMore={() => loadMoreEchos(userId, echosPagination.currentPage + 1)}
                                />
                            ) : (
                                <Coda />
                            )}
                        </div>
                    )
                ) : isLoadingUserScrolls && userScrolls.length === 0 ? (
                    <Placeholder rows={2} />
                ) : userScrolls.length === 0 ? (
                    <Notice
                        statement={isOwn ? 'You have not built a Scroll yet.' : `@${person.userName} has not built a Scroll yet.`}
                        note={
                            isOwn
                                ? 'A Feed is a rule that fills itself. A Curation is a list you keep by hand.'
                                : 'A Scroll is a rule, or a list kept by hand. Theirs will appear here.'
                        }
                        actions={
                            isOwn ? (
                                <Link to="/scroll/new" className="act h-11 px-6">
                                    Write a rule
                                </Link>
                            ) : null
                        }
                    />
                ) : (
                    <div key="scrolls" className="animate-set-in border-t border-ink">
                        {userScrolls.map((scroll) => (
                            <ScrollCard key={scroll._id} scroll={scroll} />
                        ))}
                        {scrollsPagination?.hasNext ? (
                            <More
                                shown={userScrolls.length}
                                total={scrollCount}
                                isLoading={isLoadingUserScrolls}
                                onMore={() => loadMoreScrolls(userId, 'created', scrollsPagination.currentPage + 1)}
                            />
                        ) : (
                            <Coda />
                        )}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default UserPage;
