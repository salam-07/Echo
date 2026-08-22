import {
    Colophon,
    CoverSheet,
    Folio,
    Join,
    TheObjection,
    TheRule,
    TwoModels,
} from '../components/landing';
import { useEditorialGround } from '../components/editorial/Frame.jsx';

/**
 * The landing page: one printed specification sheet, five sections, no images.
 *
 * The order is an argument. The cover prints the whole engine before making a
 * claim about it; §01 says what it objects to; §02 distinguishes the two kinds of
 * Scroll by setting them in two genuinely different ways; §03 hands the rule over
 * and lets the visitor break it; §04 asks for a handle. Nothing on the page is
 * decoration and nothing on it is a picture.
 */

const LandingPage = () => {
    useEditorialGround();

    return (
        <div className="editorial min-h-screen">
            <a
                href="#join"
                className="act sr-only px-6 py-3 focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[60]"
            >
                Skip to sign up
            </a>

            <Folio />

            <main>
                <CoverSheet />
                <TheObjection />
                <TwoModels />
                <TheRule />
                <Join />
            </main>

            <Colophon />
        </div>
    );
};

export default LandingPage;
