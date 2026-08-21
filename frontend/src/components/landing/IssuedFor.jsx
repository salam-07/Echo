import { Link } from 'react-router-dom';
import Sheet from './Sheet';
import { SHEETS } from './SheetIndex';
import { ECHOS } from './data';

/**
 * E-06 — ISSUED FOR CONSTRUCTION.
 *
 * The close. A drawing set ends with its issue sheet: what is asked of you, and
 * the index of everything that came before. The sign-up schedule is the last
 * argument on the page and the quietest — four of its rows are things Echo does
 * not want to know about you.
 */

const REQUIRED = [
    { field: 'Username', requirement: 'min 3 characters' },
    { field: 'Password', requirement: '—' },
];

const NOT_ASKED = ['Email address', 'Phone number', 'Real name', 'Contacts'];

const IssuedFor = () => (
    <Sheet
        id="issue"
        number="E-06"
        title="Issued for construction"
        scale="AS SPECIFIED"
        label="Sheet E-06 — Issued for construction"
        note={`SAMPLE CONTENT. The ${ECHOS.length} Echos shown on sheets E-01 and E-03 were written for this drawing. Every rule, limit and field named across the set is the application's own.`}
    >
        <h2 className="drafted max-w-[20ch] text-[clamp(1.75rem,3.9vw,2.875rem)] font-semibold leading-[0.95] tracking-[-0.005em] text-graphite">
            Two fields, and you are in
        </h2>
        <p className="written mt-6 max-w-[56ch] text-[1.0625rem]">
            You have already used the only part of Echo that matters. Sheet E-01 was not a demonstration of the feed
            rule — it was the feed rule.
        </p>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
            {/* ---- The action ---- */}
            <div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                    <Link
                        to="/signup"
                        className="drafted border border-graphite bg-graphite px-7 py-4 text-[0.9375rem] leading-none text-sheet transition-colors hover:border-usermark hover:bg-usermark sm:px-9 sm:py-5 sm:text-[1.0625rem]"
                    >
                        Create an account
                    </Link>
                    <Link
                        to="/login"
                        className="drafted text-[0.875rem] leading-none text-fieldname underline decoration-hairline transition-colors hover:text-graphite hover:decoration-graphite"
                    >
                        Or sign in
                    </Link>
                </div>

                <p className="written mt-10 max-w-[42ch] text-[0.9375rem] text-fieldname">
                    Set your first Scroll's eight fields whenever you like. Until then the defaults are the same ones
                    you saw at the top of this page.
                </p>
            </div>

            {/* ---- What is asked of you, and what is not ---- */}
            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-graphite">Sign-up schedule</h3>
                    <span data-dim className="text-[0.6875rem] leading-none text-fieldname">02 REQUIRED</span>
                </div>
                <div className="rule-h-heavy mt-3" />

                <dl>
                    {REQUIRED.map(({ field, requirement }) => (
                        <div
                            key={field}
                            className="flex items-baseline justify-between gap-4 border-b border-hairline py-3.5"
                        >
                            <dt className="drafted text-[0.8125rem] leading-none text-graphite">{field}</dt>
                            <dd className="typed text-[0.6875rem] leading-none text-fieldname">{requirement}</dd>
                        </div>
                    ))}
                    {NOT_ASKED.map((field) => (
                        <div
                            key={field}
                            className="flex items-baseline justify-between gap-4 border-b border-hairline py-3.5"
                        >
                            <dt className="drafted struck text-[0.8125rem] leading-none text-fieldname">{field}</dt>
                            <dd className="typed text-[0.6875rem] leading-none text-revision">not asked</dd>
                        </div>
                    ))}
                </dl>

                <p className="written mt-5 max-w-[34ch] text-[0.9375rem] text-fieldname">
                    Four of those six rows are the reason nothing can be sent to you later.
                </p>
            </div>
        </div>

        {/* ---- The printed index ---- */}
        <div className="mt-20 sm:mt-28">
            <div className="flex items-baseline justify-between gap-4">
                <h3 className="drafted text-[0.875rem] leading-none text-graphite">Index of sheets</h3>
                <span data-dim className="text-[0.6875rem] leading-none text-fieldname">
                    {String(SHEETS.length).padStart(2, '0')} SHEETS
                </span>
            </div>
            <div className="rule-h-heavy mt-3" />

            <nav aria-label="Index of sheets">
                <ol className="sm:grid sm:grid-cols-2 sm:gap-x-14 lg:grid-cols-3">
                    {SHEETS.map(({ id, number, title }) => {
                        const isThis = id === 'issue';
                        return (
                            <li key={id} className="border-b border-hairline">
                                <a
                                    href={`#${id}`}
                                    className="group flex items-baseline gap-4 py-3.5"
                                    aria-current={isThis ? 'true' : undefined}
                                >
                                    <span className="typed shrink-0 text-[0.6875rem] leading-none text-usermark">
                                        {number}
                                    </span>
                                    <span className="drafted text-[0.8125rem] leading-none text-graphite transition-colors group-hover:text-usermark">
                                        {title}
                                    </span>
                                    {isThis ? (
                                        <span data-dim className="ml-auto shrink-0 text-[0.625rem] leading-none text-fieldname">
                                            THIS SHEET
                                        </span>
                                    ) : null}
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    </Sheet>
);

export default IssuedFor;
