import Sheet from './Sheet';

/**
 * E-02 — SECTION THROUGH A TIMELINE.
 *
 * Two sections cut through the same volume. Echo has exactly eight feed
 * parameters, so both sections have exactly eight chambers: the comparison is
 * not rhetorical, it is dimensional. One is hatched and its label slots are
 * left blank. The other names every chamber it contains.
 */

const CHAMBERS = [
    { field: 'tagMatchType', note: 'how strictly your subjects must match' },
    { field: 'includedTags', note: 'the subjects you want' },
    { field: 'excludedTags', note: 'the subjects you do not' },
    { field: 'authors', note: 'whose writing you want' },
    { field: 'dateRange', note: 'how far back to look' },
    { field: 'sortBy', note: 'the order it arrives in' },
    { field: 'sortTimeRange', note: 'the window most-liked measures' },
    { field: 'excludeLikedEchos', note: 'whether what you liked comes back' },
];

const ROW = 'h-14 sm:h-[3.75rem]';

const SectionThrough = () => (
    <Sheet
        id="section"
        number="E-02"
        title="Section through a timeline"
        scale="NOT TO SCALE"
        label="Sheet E-02 — Section through a timeline"
    >
        <h2 className="drafted max-w-[26ch] text-[clamp(1.75rem,3.9vw,2.875rem)] font-semibold leading-[0.95] tracking-[-0.005em] text-graphite">
            Both hold eight chambers
        </h2>
        <p className="written mt-6 max-w-[56ch] text-[1.0625rem]">
            A feed is a volume of decisions. The question was never whether the decisions exist — it is whether you
            are shown them. Cut the same section twice and the difference is the labelling.
        </p>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
            {/* ---- SECTION A—A: the undisclosed volume ---- */}
            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-graphite">Section A—A</h3>
                    <span className="typed text-[0.6875rem] leading-none text-fieldname">an algorithmic timeline</span>
                </div>
                <div className="rule-h mt-3" />

                <div className="relative mt-8 flex">
                    <div className="w-20 shrink-0 border border-graphite/45 sm:w-28">
                        {CHAMBERS.map(({ field }) => (
                            <div key={field} className={`hatch border-b border-graphite/25 last:border-b-0 ${ROW}`} />
                        ))}
                    </div>

                    <div className="min-w-0 flex-1">
                        {CHAMBERS.map(({ field }) => (
                            <div key={field} className={`flex items-center gap-3 ${ROW}`}>
                                <span
                                    aria-hidden="true"
                                    className="w-5 shrink-0 border-t border-dashed border-hairline sm:w-9"
                                />
                                {/* The label slot, ruled and left empty. */}
                                <span aria-hidden="true" className="h-px w-14 max-w-full bg-hairline sm:w-20" />
                            </div>
                        ))}
                    </div>

                    {/* The stamp: the one mark on this page made by a hand, not a straightedge. */}
                    <span
                        aria-hidden="true"
                        className="drafted absolute left-2 top-1/2 -translate-y-1/2 -rotate-[7deg] border-2 border-revision/45 px-3 py-2 text-[0.6875rem] leading-tight text-revision/85 sm:left-6 sm:px-4"
                    >
                        Contents
                        <br />
                        not disclosed
                    </span>
                </div>

                <p className="written mt-8 max-w-[38ch] text-[0.9375rem] text-fieldname">
                    Eight label slots, ruled and left empty. You are not told what is in the volume, so you cannot
                    tell whether it is working for you.
                </p>
                <p className="sr-only">
                    Section A—A shows eight chambers, all hatched, with eight empty label slots and a stamp reading
                    “contents not disclosed”.
                </p>
            </div>

            {/* ---- SECTION B—B: the same volume, labelled ---- */}
            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-usermark">Section B—B</h3>
                    <span className="typed text-[0.6875rem] leading-none text-fieldname">an Echo feed</span>
                </div>
                <div className="rule-h-heavy mt-3" />

                <div className="mt-8 flex">
                    <div className="w-20 shrink-0 border border-usermark/45 sm:w-28">
                        {CHAMBERS.map(({ field }, index) => (
                            <div
                                key={field}
                                className={`flex items-center justify-center border-b border-usermark/20 last:border-b-0 ${ROW}`}
                            >
                                <span data-dim className="text-[0.6875rem] leading-none text-usermark/70">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="min-w-0 flex-1">
                        {CHAMBERS.map(({ field, note }) => (
                            <div key={field} className={`flex items-center gap-3 ${ROW}`}>
                                <span
                                    aria-hidden="true"
                                    className="w-5 shrink-0 border-t border-usermark/40 sm:w-9"
                                />
                                <span className="min-w-0">
                                    <span className="typed block truncate text-[0.75rem] leading-tight text-graphite">
                                        {field}
                                    </span>
                                    <span className="written block text-[0.8125rem] leading-tight text-fieldname">
                                        {note}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="written mt-8 max-w-[38ch] text-[0.9375rem] text-fieldname">
                    The same eight chambers, each carrying the name of the field it is. You set all eight on sheet
                    E-01, and you can set them again whenever the answer stops suiting you.
                </p>
            </div>
        </div>
    </Sheet>
);

export default SectionThrough;
