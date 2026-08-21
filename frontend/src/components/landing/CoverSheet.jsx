import { Link } from 'react-router-dom';
import Sheet from './Sheet';
import FeedEngine from './FeedEngine';
import { ECHOS } from './data';

/**
 * E-01 — SPECIFICATION.
 *
 * The cover sheet of the set. A header band identifies the drawing, the title
 * states the claim, and the claim is then tested in the open by the instrument
 * beneath it. Nothing on this sheet asks to be believed.
 */

const CoverSheet = () => (
    <Sheet
        id="specification"
        number="E-01"
        title="Specification"
        scale="1:1 — LIVE"
        label="Sheet E-01 — Specification: build a feed"
        note={`SAMPLE CONTENT. The ${ECHOS.length} Echos on this sheet were written for the drawing and are held in the browser. The rule applied to them is the application's own.`}
    >
        {/* Header band: identification, and the one action this sheet asks for. */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            <div className="flex items-baseline gap-4 sm:gap-6">
                <span className="drafted text-[1.0625rem] leading-none tracking-[0.22em] text-graphite">Echo</span>
                <span aria-hidden="true" className="h-3 w-px bg-hairline" />
                <span className="typed text-[0.6875rem] leading-none text-fieldname">a quieter social space</span>
            </div>

            <div className="flex items-center gap-5 sm:gap-7">
                <Link
                    to="/login"
                    className="drafted text-[0.75rem] leading-none text-fieldname underline decoration-hairline transition-colors hover:text-graphite hover:decoration-graphite"
                >
                    Sign in
                </Link>
                <Link
                    to="/signup"
                    className="drafted border border-graphite px-4 py-2.5 text-[0.75rem] leading-none text-graphite transition-colors hover:border-usermark hover:bg-usermark hover:text-sheet sm:px-5"
                >
                    Create an account
                </Link>
            </div>
        </div>

        <div className="rule-h mt-6" />

        {/* The claim. */}
        <h1 className="drafted mt-14 max-w-[22ch] text-[clamp(2.4rem,7.4vw,5.6rem)] font-semibold leading-[0.9] tracking-[-0.005em] text-graphite sm:mt-20">
            A feed you can
            <br />
            read, and redraw
        </h1>

        <p className="written mt-8 max-w-[58ch] text-[1.0625rem] sm:mt-10 sm:text-[1.125rem]">
            Echo is a place to write short posts — Echos — and to specify, in plain fields, which of them reach you.
            There is no ranking you did not write. The instrument below is not an illustration of that: it is the
            application's own feed rule, running here, on a sample set.
        </p>

        <FeedEngine />
    </Sheet>
);

export default CoverSheet;
