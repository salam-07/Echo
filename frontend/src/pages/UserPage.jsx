import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/features/echo/EchoCard';
import { ScrollCard } from '../components/features/scroll';
import { Avatar } from '../components/ui';
import useAuthStore from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { Measure, SheetHead, Section, Notice, Placeholder, Coda, More } from '../components/editorial/Apparatus';

const MAX_BIO = 280;

const MOTION = [
    { value: 'full', label: 'Full' },
    { value: 'reduce', label: 'Reduced' },
];

/** A counted quantity in the masthead. The numeral leads; the word explains it. */
const Count = ({ value, label }) => (
    <div>
        <p className="font-display text-[1.75rem] leading-none tracking-[-0.01em] text-ink">{value}</p>
        <p className="t-label mt-2">{label}</p>
    </div>
);

/** One line of the record: the term in the margin, the value beside it. */
const Term = ({ name, children }) => (
    <div className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <dt className="t-label w-40 shrink-0">{name}</dt>
        <dd className="min-w-0 break-words text-[0.9375rem] text-ink">{children}</dd>
    </div>
);

/**
 * The owner's account controls, folded into their own sheet as the third register.
 *
 * Everything the standalone settings page held now lives here: the bio they can
 * set, what is on file, the one motion preference this document keeps, and the way
 * out. The bio writes through `/profile/me`, which updates `myProfile` and the
 * signed-in user together, so the masthead above reflects the change without a
 * reload. Email is gone from the record — there is no such field to print.
 */
const AccountSettings = ({ person }) => {
    const { logout } = useAuthStore();
    const { updateMyProfile, isSavingProfile } = useProfileStore();

    const [bio, setBio] = useState(person.bio || '');
    const [motion, setMotion] = useState(() =>
        localStorage.getItem('motion') === 'reduce' ? 'reduce' : 'full',
    );

    const chooseMotion = (value) => {
        setMotion(value);
        if (value === 'reduce') {
            localStorage.setItem('motion', 'reduce');
            document.documentElement.setAttribute('data-motion', 'reduce');
        } else {
            localStorage.removeItem('motion');
            document.documentElement.removeAttribute('data-motion');
        }
    };

    const handleLogout = () => {
        logout();
    };

    const dirty = bio.trim() !== (person.bio || '').trim();

    const saveBio = async (event) => {
        event.preventDefault();
        if (!dirty || isSavingProfile) return;
        await updateMyProfile({ bio: bio.trim() });
    };

    const joined = person.createdAt
        ? new Date(person.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '—';

    return (
        <div key="settings" className="animate-set-in">
            <Section label="Bio" className="mt-6">
                <form onSubmit={saveBio} className="pt-6">
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        rows={3}
                        maxLength={MAX_BIO}
                        placeholder="Say who is writing."
                        className="field mt-4 resize-none"
                    />
                    <div className="mt-3 flex items-center justify-between gap-4">
                        <button type="submit" disabled={!dirty || isSavingProfile} className="act h-11 px-6">
                            {isSavingProfile ? 'Saving…' : 'Save bio'}
                        </button>
                        <p
                            className={`t-readout ${MAX_BIO - bio.length <= 40 ? 'text-ink' : 'text-ink-quiet'
                                }`}
                        >
                            {bio.length}/{MAX_BIO}
                        </p>
                    </div>
                </form>
            </Section>

            <Section label="Accessibility">
                <fieldset className="pt-6">
                    <p className="t-body mt-2 max-w-[48ch] text-ink-soft">
                        Echo animates one thing: a screen settling onto its baseline as it arrives.
                        Reduced holds every transition at a single frame.
                    </p>
                    <div className="mt-5 flex max-w-sm border border-rule">
                        {MOTION.map((option, index) => (
                            <label
                                key={option.value}
                                data-held={motion === option.value || undefined}
                                className={`stop t-label h-11 flex-1 whitespace-nowrap px-4 ${index > 0 ? 'border-l border-rule' : ''
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="motion"
                                    className="sr-only"
                                    checked={motion === option.value}
                                    onChange={() => chooseMotion(option.value)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                    <p className="t-readout mt-3 text-ink-quiet">
                        Your operating system's own setting is honoured either way.
                    </p>
                </fieldset>
            </Section>

            <Section label="Session">
                <div className="pt-6 mb-6">
                    <p className="text-[0.9375rem] font-medium text-ink">Sign out of this browser.</p>
                    <p className="t-body mt-2 max-w-[48ch] text-ink-soft">
                        Your echos, feeds, and curations stay exactly as they are.
                    </p>
                    <button type="button" onClick={handleLogout} className="act act-alarm mt-5 h-11 px-6">
                        Sign out
                    </button>
                </div>
            </Section>
        </div>
    );
};

/**
 * A person's own sheet: the masthead, then everything they have written or built.
 *
 * This is the one screen where the square plate appears — a name at masthead scale
 * wants a mark beside it, and here the name is the subject of the page rather than
 * a byline inside a row. The old page set the username at 72px and put a Follow
 * button beside it that only wrote to the console; there is no endpoint behind
 * following a person, so the button is gone rather than pretending.
 *
 * For the owner this sheet is also their settings. The old standalone page is
 * folded in as a third register — Settings — carrying the bio they can set, what
 * is on file, the motion preference, and the way out. `/settings` still resolves
 * here and opens straight onto that register.
 *
 * Counts come from the paginated totals, not from `list.length`, which only ever
 * knew about the first ten.
 */
const UserPage = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const { authUser } = useAuthStore();
    const [register, setRegister] = useState(() => (pathname === '/settings' ? 'settings' : 'echos'));

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

    /* Settings is the owner's register. Landing on `/settings` opens it; leaving
       your own sheet for someone else's drops back to a register that exists there. */
    useEffect(() => {
        if (pathname === '/settings') setRegister('settings');
    }, [pathname]);

    useEffect(() => {
        if (!isOwn) setRegister((current) => (current === 'settings' ? 'echos' : current));
    }, [isOwn]);

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

    const rail = [
        { value: 'echos', label: 'Echos', count: echoCount },
        { value: 'scrolls', label: 'Scrolls', count: scrollCount },
        ...(isOwn ? [{ value: 'settings', label: 'Settings' }] : []),
    ];

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
                                    className={`stop t-label h-11 flex-1 gap-2 whitespace-nowrap px-4 ${index > 0 ? 'border-l border-rule' : ''
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="register"
                                        className="sr-only"
                                        checked={register === item.value}
                                        onChange={() => setRegister(item.value)}
                                    />
                                    {item.label}{' '}
                                    {item.count !== undefined && <span aria-hidden="true">{item.count}</span>}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </SheetHead>

                {register === 'settings' && isOwn ? (
                    <AccountSettings person={person} />
                ) : register === 'echos' ? (
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
