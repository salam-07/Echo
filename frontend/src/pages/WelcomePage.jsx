import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';
import { useScrollStore } from '../store/useScrollStore';
import { markOnboarded } from '../lib/onboarding';
import { Sheet, useEditorialGround } from '../components/editorial/Frame';
import { FrontMatter, FirstFeed } from '../components/onboarding';

/**
 * The front matter of the reader's own volume — the pages before the corpus begins.
 *
 * A new account lands here straight from signup. Two leaves: the one idea, then the
 * rule that proves it. This page owns nothing but the orchestration — the ground it
 * sits on, which leaf shows, and what committing a rule actually does. The leaves
 * are told what to render and given the handlers; the mutation of real state (a
 * Scroll created, a Scroll selected, the sheet marked done) lives here so there is
 * one place that knows how the flow ends.
 *
 * Skippable throughout, from the running head, and never forced twice — /welcome
 * stays open for a second reading, but signup only sends the reader here once.
 */
const WelcomePage = () => {
    useEditorialGround();
    const navigate = useNavigate();
    const authUser = useAuthStore((state) => state.authUser);
    const createScroll = useScrollStore((state) => state.createScroll);
    const setSelectedScroll = useScrollStore((state) => state.setSelectedScroll);
    const isCreatingScroll = useScrollStore((state) => state.isCreatingScroll);

    const [step, setStep] = useState('greet');

    const leave = () => {
        markOnboarded(authUser?._id);
        navigate('/');
    };

    const commit = async (payload) => {
        try {
            const scroll = await createScroll(payload);
            if (!scroll) return;
            /* Hold the new rule so Home opens on it directly — its echoes load,
               the running head names it, and there is no empty first-run notice
               in between. The store already prepended it to the list, so Home
               never reads as ruleless on arrival. */
            setSelectedScroll(scroll);
            markOnboarded(authUser?._id);
            navigate('/');
        } catch {
            /* createScroll has already printed the failure; stay on the sheet. */
        }
    };

    return (
        <main className="min-h-screen bg-paper text-ink">
            <Sheet className="py-14 md:py-20">
                <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <ol className="flex flex-col self-start border border-rule sm:flex-row sm:self-auto">
                        <li
                            className={`t-label flex h-9 items-center whitespace-nowrap px-4 ${
                                step === 'greet' ? 'bg-ink text-paper' : 'text-ink-quiet'
                            }`}
                        >
                            i · Welcome
                        </li>
                        <li
                            className={`t-label flex h-9 items-center whitespace-nowrap border-t border-rule px-4 sm:border-l sm:border-t-0 ${
                                step === 'build' ? 'bg-ink text-paper' : 'text-ink-quiet'
                            }`}
                        >
                            ii · Your first Feed
                        </li>
                    </ol>
                    <button
                        type="button"
                        onClick={leave}
                        className="act act-quiet h-9 self-start px-4 sm:self-auto"
                    >
                        Skip to Echo
                    </button>
                </div>

                {step === 'greet' ? (
                    <FrontMatter handle={authUser?.userName} onBegin={() => setStep('build')} />
                ) : (
                    <FirstFeed
                        onCommit={commit}
                        isCommitting={isCreatingScroll}
                        onBack={() => setStep('greet')}
                    />
                )}
            </Sheet>
        </main>
    );
};

export default WelcomePage;
