import Sheet from './Sheet';
import { ECHOS } from './data';

/**
 * E-03 — TWO WAYS TO SPECIFY.
 *
 * A Scroll is either a curation or a feed, and the difference is the difference
 * between a parts list and a rule. The drawing states it the way a drawing
 * would: one schedule closes with a total, the other carries an open dimension,
 * because its quantity is not fixed until it is resolved.
 */

const CURATED = [2, 6, 10, 15, 20].map((index) => ECHOS[index]).filter(Boolean);

const RULE_LINES = [
    ['type', "'feed'"],
    ['feedConfig.tagMatchType', "'any'"],
    ['feedConfig.includedTags', "['reading', 'craft']"],
    ['feedConfig.excludedTags', '[]'],
    ['feedConfig.sortBy', "'newestFirst'"],
];

const TwoWays = () => (
    <Sheet
        id="two-ways"
        number="E-03"
        title="Two ways to specify"
        scale="AS SPECIFIED"
        label="Sheet E-03 — Two ways to specify a Scroll"
    >
        <h2 className="drafted max-w-[26ch] text-[clamp(1.75rem,3.9vw,2.875rem)] font-semibold leading-[0.95] tracking-[-0.005em] text-graphite">
            A parts list, or a rule
        </h2>
        <p className="written mt-6 max-w-[58ch] text-[1.0625rem]">
            A Scroll is a collection you keep. You can fill it by hand, naming each Echo you want in it, or you can
            write a rule and let it resolve. Both are yours; both can be private. Nothing else fills them.
        </p>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
            {/* ---- A curation: closed, enumerated, finite ---- */}
            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-graphite">A curation</h3>
                    <span className="typed text-[0.6875rem] leading-none text-fieldname">type: 'curation'</span>
                </div>
                <div className="rule-h-heavy mt-3" />

                <div className="mt-6 grid grid-cols-[2rem_3.25rem_1fr] gap-x-3 pb-2 sm:grid-cols-[2.25rem_3.75rem_1fr] sm:gap-x-4">
                    <span className="fieldname">Item</span>
                    <span className="fieldname">Mark</span>
                    <span className="fieldname">Description</span>
                </div>
                <div className="rule-h" />

                <ul>
                    {CURATED.map((echo, index) => (
                        <li
                            key={echo.id}
                            className="grid grid-cols-[2rem_3.25rem_1fr] gap-x-3 border-b border-hairline py-3 sm:grid-cols-[2.25rem_3.75rem_1fr] sm:gap-x-4"
                        >
                            <span data-dim className="text-[0.6875rem] leading-relaxed text-fieldname">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="typed text-[0.6875rem] leading-relaxed text-usermark">{echo.id}</span>
                            <span className="min-w-0">
                                <span className="drafted block text-[0.75rem] leading-none text-graphite">
                                    {echo.author}
                                </span>
                                <span className="written mt-1 block text-[0.875rem] leading-snug">
                                    {echo.content.length > 58 ? `${echo.content.slice(0, 58).trimEnd()}…` : echo.content}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="fieldname">Total items</span>
                    <span data-dim className="text-[0.875rem] leading-none text-graphite">
                        {String(CURATED.length).padStart(2, '0')}
                    </span>
                </div>

                {/* Closed at both ends: a finite quantity. */}
                <div aria-hidden="true" className="mt-5 flex items-center">
                    <span className="block h-[9px] w-px shrink-0 rotate-45 bg-graphite" />
                    <span className="rule-h flex-1" />
                    <span className="block h-[9px] w-px shrink-0 rotate-45 bg-graphite" />
                </div>
                <p className="written mt-4 max-w-[38ch] text-[0.9375rem] text-fieldname">
                    Five entries, because you chose five. It will hold five until you choose otherwise.
                </p>
            </div>

            {/* ---- A feed: open, parametric, resolved at read time ---- */}
            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-usermark">A feed</h3>
                    <span className="typed text-[0.6875rem] leading-none text-fieldname">type: 'feed'</span>
                </div>
                <div className="rule-h-heavy mt-3" />

                <div className="vellum mt-6 px-4 py-4 sm:px-5 sm:py-5">
                    <span className="fieldname block">Specification</span>
                    <dl className="mt-3">
                        {RULE_LINES.map(([key, value]) => (
                            <div key={key} className="flex flex-wrap items-baseline gap-x-3 border-t border-hairline/70 py-2 first:border-t-0 first:pt-0">
                                <dt className="typed text-[0.6875rem] leading-relaxed text-fieldname">{key}</dt>
                                <dd className="typed ml-auto text-[0.6875rem] leading-relaxed text-graphite">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-6 flex items-baseline justify-between gap-4">
                    <span className="fieldname">Total items</span>
                    <span data-dim className="text-[0.875rem] leading-none text-usermark">
                        Resolved on reading
                    </span>
                </div>

                {/* Open at one end: the quantity is not fixed until the rule runs. */}
                <div aria-hidden="true" className="mt-5 flex items-center">
                    <span className="block h-[9px] w-px shrink-0 rotate-45 bg-usermark" />
                    <span className="h-px flex-1 bg-gradient-to-r from-usermark/70 to-transparent" />
                </div>
                <p className="written mt-4 max-w-[38ch] text-[0.9375rem] text-fieldname">
                    However many satisfy the rule at the moment you open it. Tomorrow that is a different number, and
                    the reason it changed is written down.
                </p>
            </div>
        </div>
    </Sheet>
);

export default TwoWays;
