import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet } from '../editorial/Frame.jsx';
import { EASE, dispose, gsap, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';

/**
 * §04 — join.
 *
 * The one inverted spread on the sheet, and the only place the document raises
 * its voice: black ground, chalk type, the same hairlines. It asks for a handle
 * and nothing else, because an account here genuinely is a handle and a password
 * — no email address exists to ask for. The constraints are printed beside the
 * field rather than sprung on submit.
 *
 * It gets the page's one material gesture. Everywhere else, marks arrive onto
 * paper that is already there; here the ground itself arrives, wiped down from the
 * top edge as if the ink were laid on in a single pass. It is the only clip on the
 * sheet, and it earns the exception by being the only place the paper changes
 * colour. Nothing else in this section is revealed separately — the wipe brings
 * the whole spread with it, and only the statement is held back to be set on top,
 * so the order reads as ground first, then words.
 */

const MIN_HANDLE = 3;

const Join = () => {
    const navigate = useNavigate();
    const [handle, setHandle] = useState('');
    const [error, setError] = useState('');
    const scope = useRef(null);

    useSectionMotion(scope, {
        full: () => {
            const section = scope.current;
            const cue = { trigger: section, start: 'top 88%', once: true };

            const wipe = gsap.fromTo(
                section,
                { clipPath: 'inset(100% 0% 0% 0%)' },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 1.5,
                    ease: EASE,
                    scrollTrigger: { ...cue },
                },
            );

            const title = setLines('[data-title]', {
                root: section,
                trigger: section,
                start: cue.start,
                delay: 0.95,
                duration: 1.3,
                stagger: 0.18,
            });

            return () => dispose(wipe, title);
        },
        /* No wipe under reduce: a full-spread reveal is a great deal of visual
           change, and the statement taking ink says the same thing quietly. */
        calm: () => {
            const tween = inkOnly('[data-title]', {
                duration: 0.6,
                scrollTrigger: { trigger: scope.current, start: 'top 88%', once: true },
            });
            return () => dispose(tween);
        },
    });

    const submit = (event) => {
        event.preventDefault();
        const claim = handle.trim();
        if (claim.length < MIN_HANDLE) {
            setError(`Enter a username with at least ${MIN_HANDLE} characters.`);
            return;
        }
        navigate(`/signup?u=${encodeURIComponent(claim)}`);
    };

    return (
        <section
            ref={scope}
            id="join"
            aria-labelledby="join-title"
            className="inverted bg-obsidian text-chalk"
        >
            <Sheet>

                <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-16 py-24 lg:py-40">
                    <div className="col-span-12 lg:col-span-6">
                        <h2 id="join-title" data-title className="t-display max-w-[9.6em]">
                            <span className="block text-chalk-quiet">Join Echo.</span>
                            <span className="block text-chalk">Make it yours.</span>
                        </h2>
                    </div>

                    <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                        <form onSubmit={submit} noValidate>
                            <label htmlFor="claim" className="t-label block text-chalk">
                                Choose a username
                            </label>

                            <div className="mt-5 flex items-baseline gap-3">
                                <span aria-hidden="true" className="text-[1.25rem] font-light text-chalk-dim">
                                    @
                                </span>
                                <input
                                    id="claim"
                                    name="claim"
                                    type="text"
                                    autoComplete="username"
                                    spellCheck="false"
                                    value={handle}
                                    onChange={(event) => {
                                        setHandle(event.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="yourname"
                                    aria-invalid={error ? 'true' : undefined}
                                    aria-describedby={error ? 'claim-error' : 'claim-terms'}
                                    className="field min-w-0"
                                />
                            </div>

                            {error ? (
                                <p id="claim-error" role="alert" className="t-body mt-4 text-chalk">
                                    {error}
                                </p>
                            ) : null}

                            <button type="submit" className="act mt-10 h-12 w-full px-8 sm:w-auto">
                                Continue to sign up
                            </button>
                        </form>

                        <p id="claim-terms" className="t-body mt-6 text-chalk-quiet">
                            At least 3 characters. You will choose a password next. No email needed.
                        </p>

                        <p className="t-body mt-8 text-chalk-quiet">
                            Already have an account?{' '}
                            <Link to="/login" className="link-rule text-chalk">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default Join;
