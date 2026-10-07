import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rule, Sheet, useEditorialGround } from '../editorial/Frame.jsx';

/** Shared two-column layout for sign-up and sign-in. */

/* -- Field ---------------------------------------------------------------- */

/**
 * One field, one hairline. The label sits above in the document's own label
 * register; the hint sits below and stays put, so the field never changes height
 * when an error replaces it. Errors are named and paired with the fix.
 */
export const Field = ({
    label,
    value,
    onChange,
    error,
    hint,
    type = 'text',
    autoComplete,
    placeholder,
    prefix,
    reveal = false,
    disabled = false,
}) => {
    const id = useId();
    const [shown, setShown] = useState(false);
    const resolvedType = reveal && shown ? 'text' : type;
    const messageId = `${id}-message`;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={id} className="t-label t-label--ink">
                    {label}
                </label>
                {reveal ? (
                    <button
                        type="button"
                        onClick={() => setShown((s) => !s)}
                        aria-label={shown ? 'Hide password' : 'Show password'}
                        aria-controls={id}
                        className="t-label link-rule transition-colors hover:text-ink"
                    >
                        {shown ? 'Hide' : 'Show'}
                    </button>
                ) : null}
            </div>

            <div className="mt-3 flex items-baseline gap-3">
                {prefix ? (
                    <span aria-hidden="true" className="text-[1.25rem] font-light text-ink-quiet">
                        {prefix}
                    </span>
                ) : null}
                <input
                    id={id}
                    type={resolvedType}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    disabled={disabled}
                    spellCheck="false"
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error || hint ? messageId : undefined}
                    className="field min-w-0"
                />
            </div>

            {error ? (
                <p id={messageId} role="alert" className="mt-3 text-[0.8125rem] leading-[1.5] text-alarm">
                    {error}
                </p>
            ) : hint ? (
                <p id={messageId} className="t-label mt-3 normal-case tracking-[0.04em]">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

/* -- The spread ----------------------------------------------------------- */

const AuthSheet = ({ statement, deck, children }) => {
    useEditorialGround();

    return (
        <div className="editorial flex min-h-screen flex-col">
            <header>
                <Sheet>
                    <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
                        <Link
                            to="/"
                            className="font-display text-[1.375rem] leading-none tracking-[-0.01em] text-ink"
                        >
                            Echo
                        </Link>
                    </div>
                </Sheet>
                <Rule />
            </header>

            <main className="flex-1">
                <Sheet>
                    <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-16 py-16 lg:py-28">
                        <div className="col-span-12 lg:col-span-5 lg:self-center">
                            <h1 className="t-headline max-w-[10.8em]">{statement}</h1>
                            {deck ? <p className="t-deck mt-8 max-w-[40ch] text-ink-soft">{deck}</p> : null}
                        </div>

                        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pl-12">
                            <div className="max-w-[26rem]">{children}</div>
                        </div>
                    </div>
                </Sheet>
            </main>
            {/* 
            <footer>
                <Sheet>
                    <div className="flex flex-col gap-3 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                        <Link to="/" className="t-label link-rule transition-colors hover:text-ink">
                            Back to home
                        </Link>
                    </div>
                </Sheet>
            </footer> */}
        </div>
    );
};

export default AuthSheet;
