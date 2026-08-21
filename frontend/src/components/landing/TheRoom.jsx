import { useState } from 'react';
import Sheet from './Sheet';
import { DimH } from './Dimension';

/**
 * E-05 — THE ROOM YOU WRITE IN.
 *
 * The one sheet with warmth in it, and the only place the visitor's own words
 * appear. An Echo is a thousand characters; a reply is five hundred. So the two
 * dimensions are drawn to relative scale — the reply line is literally half the
 * length of the Echo line — and the field itself is a working specimen sitting
 * directly on the paper, with the graph ruling visible through it.
 *
 * It posts nowhere, and the sheet says so.
 */

const ECHO_LIMIT = 1000;
const REPLY_LIMIT = 500;

const TheRoom = () => {
    const [draft, setDraft] = useState('');
    const atLimit = draft.length >= ECHO_LIMIT;

    return (
        <Sheet
            id="the-room"
            number="E-05"
            title="The room you write in"
            scale="1:1"
            label="Sheet E-05 — The room you write in"
            note="SPECIMEN. The field on this sheet is a working drawing of the composer. Nothing typed into it is sent, stored, or posted."
        >
            <h2 className="drafted max-w-[22ch] text-[clamp(1.75rem,3.9vw,2.875rem)] font-semibold leading-[0.95] tracking-[-0.005em] text-graphite">
                A thousand characters is the whole room
            </h2>
            <p className="written mt-6 max-w-[56ch] text-[1.0625rem]">
                Long enough for a thought you finished. Short enough that you will finish it. Replies get five
                hundred. Nothing you write is amplified or buried on your behalf — it goes out at the same size as
                everything else.
            </p>

            <div className="mt-16 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-14">
                <div>
                    <DimH label={`${ECHO_LIMIT} CHARACTERS`} tone="mark" className="mb-6" />

                    <div className="relative border border-hairline">
                        <label htmlFor="specimen" className="fieldname absolute -top-2 left-4 bg-sheet px-2">
                            Echo
                        </label>
                        <textarea
                            id="specimen"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            maxLength={ECHO_LIMIT}
                            rows={7}
                            spellCheck="false"
                            placeholder="Say one thing."
                            aria-describedby="specimen-note"
                            className="written block w-full resize-none bg-transparent px-4 pb-4 pt-6 text-[1.0625rem] text-graphite placeholder:text-hairline sm:px-6 sm:pb-6 sm:pt-8"
                        />

                        {/* The fill dimension: how much of the room is used. */}
                        <div className="mx-4 h-px bg-hairline sm:mx-6">
                            <div
                                className={`h-px transition-[width] duration-200 ease-out ${
                                    atLimit ? 'bg-revision' : 'bg-usermark'
                                }`}
                                style={{ width: `${(draft.length / ECHO_LIMIT) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-6">
                            <p id="specimen-note" className="typed text-[0.6875rem] leading-none text-fieldname">
                                posts nowhere
                            </p>
                            <p className="flex items-baseline gap-1.5 leading-none">
                                <span
                                    data-dim
                                    className={`text-[1.125rem] leading-none ${atLimit ? 'text-revision' : 'text-usermark'}`}
                                >
                                    {draft.length}
                                </span>
                                <span data-dim className="text-[0.6875rem] leading-none text-fieldname">
                                    / {ECHO_LIMIT}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Drawn to relative scale: the reply line is half the Echo line. */}
                    <div className="mt-12 w-1/2">
                        <DimH label={`${REPLY_LIMIT} — A REPLY`} className="mb-3" />
                        <div className="border border-dashed border-hairline px-4 py-4">
                            <p className="written text-[0.875rem] text-fieldname">
                                Half the room, for answering in.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-14 lg:mt-0">
                    <div className="rule-h-heavy" />
                    <dl className="mt-4">
                        <div className="border-b border-hairline py-3.5">
                            <dt className="fieldname">Echo</dt>
                            <dd data-dim className="mt-1.5 text-[0.8125rem] leading-none text-graphite">
                                {ECHO_LIMIT} characters
                            </dd>
                        </div>
                        <div className="border-b border-hairline py-3.5">
                            <dt className="fieldname">Reply</dt>
                            <dd data-dim className="mt-1.5 text-[0.8125rem] leading-none text-graphite">
                                {REPLY_LIMIT} characters
                            </dd>
                        </div>
                        <div className="border-b border-hairline py-3.5">
                            <dt className="fieldname">Attachments</dt>
                            <dd data-dim className="mt-1.5 text-[0.8125rem] leading-none text-graphite">None</dd>
                        </div>
                        <div className="border-b border-hairline py-3.5">
                            <dt className="fieldname">Reach</dt>
                            <dd data-dim className="mt-1.5 text-[0.8125rem] leading-none text-graphite">
                                Whoever specified you
                            </dd>
                        </div>
                    </dl>
                    <p className="written mt-6 max-w-[32ch] text-[0.9375rem] text-fieldname">
                        Words and tags. That is the whole composer — which is why nobody here is competing at
                        production values.
                    </p>
                </div>
            </div>
        </Sheet>
    );
};

export default TheRoom;
