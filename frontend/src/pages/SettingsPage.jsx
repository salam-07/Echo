import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import useAuthStore from '../store/useAuthStore';
import { Measure, SheetHead, Section } from '../components/editorial/Apparatus';

const MOTION = [
    { value: 'full', label: 'Full' },
    { value: 'reduce', label: 'Reduced' },
];

const Term = ({ name, children }) => (
    <div className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <dt className="t-label w-40 shrink-0">{name}</dt>
        <dd className="min-w-0 break-words text-[0.9375rem] text-ink">{children}</dd>
    </div>
);

/**
 * The account's own colophon: what is on file, the one preference this document
 * has, and the way out.
 *
 * The dark-mode switch is gone, with the theme it toggled. Two stocks meant every
 * hairline, every inversion, and every struck entry had to hold twice, and the
 * second one was never the design — it was the first one, dimmed. There is one
 * paper.
 *
 * What remains is a real preference: motion. It writes `localStorage.motion`,
 * which App.jsx applies to the root before any route paints, and which the CSS
 * reads beside the reader's OS setting.
 */
const SettingsPage = () => {
    const { logout, authUser } = useAuthStore();
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
        if (window.confirm('Sign out of Echo?')) logout();
    };

    const joined = authUser?.createdAt
        ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '—';

    return (
        <Layout>
            <Measure>
                <SheetHead
                    label="Settings"
                    subject="Your terms."
                    deck="What Echo holds about you, and the one preference it keeps for you."
                />

                <Section label="On file" className="mt-4">
                    <dl>
                        <Term name="Name">@{authUser?.userName}</Term>
                        <Term name="Email">{authUser?.email}</Term>
                        <Term name="Writing since">{joined}</Term>
                    </dl>
                    <p className="t-readout mt-4 text-ink-quiet">
                        These are fixed for now. Nothing else is stored.
                    </p>
                </Section>

                <Section label="Motion">
                    <fieldset className="pt-6">
                        <legend className="text-[0.9375rem] font-medium text-ink">
                            How much should the page move?
                        </legend>
                        <p className="t-body mt-2 max-w-[48ch] text-ink-soft">
                            Echo animates one thing: a screen settling onto its baseline as it
                            arrives. Reduced holds every transition at a single frame.
                        </p>
                        <div className="mt-5 flex max-w-sm border border-rule">
                            {MOTION.map((option, index) => (
                                <label
                                    key={option.value}
                                    data-held={motion === option.value || undefined}
                                    className={`stop t-label h-11 flex-1 whitespace-nowrap px-4 ${
                                        index > 0 ? 'border-l border-rule' : ''
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
                    <div className="pt-6">
                        <p className="text-[0.9375rem] font-medium text-ink">
                            Sign out of this browser.
                        </p>
                        <p className="t-body mt-2 max-w-[48ch] text-ink-soft">
                            Your echos, feeds, and curations stay exactly as they are.
                        </p>
                        <button type="button" onClick={handleLogout} className="act act-alarm mt-5 h-11 px-6">
                            Sign out
                        </button>
                    </div>
                </Section>

                <div className="mt-16 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule py-8">
                    <p className="t-label">Echo · Version 1.0</p>
                    <Link to="/" className="t-label link-rule text-rule-strong hover:text-ink">
                        Back to the corpus
                    </Link>
                </div>
            </Measure>
        </Layout>
    );
};

export default SettingsPage;
