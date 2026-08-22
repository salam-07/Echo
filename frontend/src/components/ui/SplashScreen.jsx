import React from 'react';

/**
 * The title page. It is on screen for a fixed 1.5s while auth is checked, so it
 * gets the document's two press verbs and nothing else: the wordmark sets, and a
 * hairline is struck across the measure beneath it.
 *
 * The old splash printed `logo_white.png` — a white mark, on paper. It was
 * invisible. The word is the wordmark here, in the face that carries every other
 * statement in this document.
 */
const SplashScreen = () => (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="t-label animate-set-in">Echo</p>

        <h1
            className="t-headline animate-set-in mt-6 text-center"
            style={{ animationDelay: '80ms' }}
        >
            There is no algorithm here.
        </h1>

        <div
            aria-hidden="true"
            className="animate-strike mt-8 h-px w-full max-w-[26rem] origin-left bg-rule"
            style={{ animationDelay: '240ms' }}
        />

        <p
            aria-live="polite"
            className="t-label animate-set-in mt-5 normal-case tracking-[0.04em]"
            style={{ animationDelay: '400ms' }}
        >
            Setting your sheet…
        </p>
    </div>
);

export default SplashScreen;
