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

/** Explain Echo, show how Scrolls work, and invite visitors to join. */

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
