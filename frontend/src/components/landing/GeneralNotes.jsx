import Sheet from './Sheet';
import { DimV } from './Dimension';

/**
 * E-04 — GENERAL NOTES.
 *
 * The emptiest sheet in the set, and deliberately so: this is the one about
 * silence, and a sheet that argued for quiet while filling itself would be
 * lying. The void in the left margin carries a dimension, because a measured
 * emptiness reads as a decision and an unmeasured one reads as an unfinished
 * page.
 *
 * Each note ends in a typed line naming the mechanism it rests on, in the
 * vocabulary sheet E-01 already taught. No note claims anything the product
 * does not do.
 */

const NOTES = [
    {
        title: 'There is no email address',
        body: 'Signing up asks for a username and a password. There is no email field on the form, so there is no address to add to a list, and nothing to unsubscribe from later.',
        basis: 'sign-up = { username, password }',
    },
    {
        title: 'Nothing is sent to you',
        body: 'No notifications, no badges, no digests, no re-engagement. When you close Echo, Echo stops. Coming back is a thing you decide to do, not a thing you are prompted into.',
        basis: 'no notification of any kind exists',
    },
    {
        title: 'No ranking you did not write',
        body: 'Order comes from sortBy, and sortBy is a field you set — newest, oldest, or most liked. There is no second pass that reorders the result afterwards on grounds you were not told.',
        basis: "order = sortBy ∈ { newestFirst, oldestFirst, mostLiked }",
    },
    {
        title: 'Likes are an input, not a score',
        body: 'Likes and dislikes are here, and they are visible. What they are not is a vote on what you see next. They are an instrument you can aim at your own feed: sort by them, or leave out what you have already liked.',
        basis: "sortBy: 'mostLiked'  ·  excludeLikedEchos: true",
    },
    {
        title: 'Private means unlisted and unopenable',
        body: 'A Scroll you mark private is left out of search results and cannot be opened by anyone else. Privacy is a declaration you make about a thing you built, not a permission you request.',
        basis: 'isPrivate: true → not searched, not readable by others',
    },
];

const GeneralNotes = () => (
    <Sheet
        id="general-notes"
        number="E-04"
        title="General notes"
        scale="NONE"
        label="Sheet E-04 — General notes on silence and privacy"
    >
        <h2 className="drafted max-w-[24ch] text-[clamp(1.75rem,3.9vw,2.875rem)] font-semibold leading-[0.95] tracking-[-0.005em] text-graphite">
            Nothing here is trying to reach you
        </h2>
        <p className="written mt-6 max-w-[54ch] text-[1.0625rem]">
            Silence is not a setting on Echo. It is what is left over when the machinery that interrupts you was never
            built in the first place.
        </p>

        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[2.5rem_minmax(0,36rem)_minmax(0,1fr)] lg:gap-x-14">
            {/* The margin, measured. */}
            <DimV label="Intentionally blank" className="hidden lg:flex" />

            <div>
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="drafted text-[0.875rem] leading-none text-graphite">General notes</h3>
                    <span data-dim className="text-[0.6875rem] leading-none text-fieldname">
                        {String(NOTES.length).padStart(2, '0')} ITEMS
                    </span>
                </div>
                <div className="rule-h-heavy mt-3" />

                <ol>
                    {NOTES.map(({ title, body, basis }, index) => (
                        <li
                            key={title}
                            className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-hairline py-7 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-x-5 sm:py-9"
                        >
                            <span data-dim className="pt-[0.1875rem] text-[0.75rem] leading-none text-hairline">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h4 className="drafted text-[0.9375rem] leading-tight text-graphite">{title}</h4>
                                <p className="written mt-2.5 text-[0.9375rem]">{body}</p>
                                <p className="typed mt-3.5 text-[0.6875rem] leading-relaxed text-usermark">{basis}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Column three is empty, and stays empty. */}
            <div aria-hidden="true" />
        </div>
    </Sheet>
);

export default GeneralNotes;
