/**
 * One Echo, entered on a schedule.
 *
 * Not a card. A drawing set records items as ruled rows in a schedule — mark
 * number in the left gutter, description in the body, quantity at the right —
 * so that is what an Echo is here. The only ornament is the rule beneath it.
 *
 * Tags the visitor named are set in their own ink, so a passing row shows on
 * its face why it passed. A rejected row keeps its text readable and carries
 * the clause that struck it out, because a rule you cannot audit is a rule you
 * are trusting rather than reading.
 */

const age = (ageDays) => {
    if (ageDays < 1) return `${Math.max(1, Math.round(ageDays * 24))} H`;
    if (ageDays < 60) return `${Math.round(ageDays)} D`;
    if (ageDays < 730) return `${Math.round(ageDays / 30)} MO`;
    return `${(ageDays / 365).toFixed(1)} YR`;
};

const EchoEntry = ({ echo, marked, rejection }) => {
    const struck = Boolean(rejection);

    return (
        <li
            className={`grid grid-cols-[3.25rem_1fr] gap-x-3 border-b border-hairline py-4 sm:grid-cols-[4rem_1fr] sm:gap-x-5 sm:py-5 ${
                struck ? 'opacity-[0.62]' : ''
            }`}
        >
            <span className="typed pt-px text-[0.6875rem] leading-tight text-fieldname">{echo.id}</span>

            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="drafted text-[0.8125rem] leading-none text-graphite">
                        {echo.author}
                        <span className="text-hairline"> — </span>
                        <span data-dim className="text-fieldname">
                            {age(echo.ageDays)} AGO
                        </span>
                    </p>
                    <p data-dim className="shrink-0 text-[0.6875rem] leading-none text-fieldname">
                        {echo.likes} <span className="text-hairline">LIKED</span>
                        {echo.dislikes > 0 ? (
                            <>
                                <span className="text-hairline"> / </span>
                                {echo.dislikes} <span className="text-hairline">NOT</span>
                            </>
                        ) : null}
                    </p>
                </div>

                <p className={`written mt-2 max-w-[62ch] text-[0.9375rem] ${struck ? 'struck' : ''}`}>
                    {echo.content}
                </p>

                <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {echo.tags.map((tag) => (
                        <span
                            key={tag}
                            className={`typed text-[0.6875rem] leading-none ${
                                marked?.has(tag) ? 'text-usermark' : 'text-fieldname'
                            }`}
                        >
                            {tag}
                        </span>
                    ))}
                    {echo.viewerLiked ? (
                        <span data-dim className="text-[0.625rem] leading-none text-fieldname">
                            YOU LIKED THIS
                        </span>
                    ) : null}
                </div>

                {rejection ? (
                    <p className="typed mt-2.5 text-[0.6875rem] leading-relaxed text-revision">
                        {rejection.clause}
                        <span className="opacity-55"> — {rejection.detail}</span>
                    </p>
                ) : null}
            </div>
        </li>
    );
};

export default EchoEntry;
