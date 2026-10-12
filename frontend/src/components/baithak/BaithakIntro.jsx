import { useRef } from 'react';
import { gsap, dispose, useSectionMotion } from '../editorial/motion';
import { BaithakLink } from './BaithakPromo';
import './Baithak.css';

export default function BaithakIntro({ onReturn }) {
    const scope = useRef(null);
    useSectionMotion(scope, {
        full: () => {
            if (document.documentElement.dataset.motion === 'reduce') return;
            const sequence = gsap.timeline()
                .from('[data-intro-mark]', { clipPath: 'inset(0 0 0 100%)', duration: 1.3, ease: 'expo.out' })
                .from('[data-intro-thread]', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'expo.out' }, 0.35)
                .from('[data-intro-future]', { opacity: 0, x: -16, duration: 0.8, ease: 'expo.out' }, 0.8);
            return () => dispose(sequence);
        },
    });
    return <section ref={scope} className="baithak baithak-intro" aria-labelledby="baithak-intro-title">
        <div className="baithak-intro-opening">
            <h1 id="baithak-intro-title">A new project.<br /><span>From Echo, for Punjab.</span></h1>
            <img data-intro-mark src="/baithak.svg" alt="Baithak in Shahmukhi calligraphy" width="422" height="246" />
            <p className="baithak-name">baithak <span>By Echo</span></p>
        </div>
        <div className="baithak-intro-copy">
            <p>Introducing Baithak, Echo’s new platform to share and discover Punjab’s folk stories.</p>
            <p>For the stories passed from one generation to the next. For the folklore that keeps a place alive. An initiative to preserve Punjab’s rich heritage, and carry it forward together.</p>
        </div>
        <div className="baithak-inheritance" aria-hidden="true">
            <span>Passed down.</span><i data-intro-thread /><span data-intro-future>Carried forward.</span>
        </div>
        <div className="baithak-intro-actions">
            <BaithakLink>Visit Baithak</BaithakLink>
            <button type="button" className="baithak-return" onClick={onReturn}>Back to your feed</button>
        </div>
    </section>;
}
