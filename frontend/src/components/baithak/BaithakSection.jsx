import { useRef } from 'react';
import { gsap, dispose, useSectionMotion } from '../editorial/motion';
import { BaithakLink } from './BaithakPromo';
import './Baithak.css';

export default function BaithakSection() {
    const scope = useRef(null);
    useSectionMotion(scope, {
        full: () => {
            if (document.documentElement.dataset.motion === 'reduce') return;
            const sequence = gsap.timeline({scrollTrigger: {trigger: scope.current, start: 'top 75%', once: true}})
                .from('[data-baithak-mark]', {clipPath: 'inset(0 0 0 100%)', duration: 1.2, ease: 'expo.out'})
                .from('[data-baithak-thread]', {scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'expo.out'}, 0.3)
                .from('[data-baithak-forward]', {opacity: 0, x: -18, duration: 0.8, ease: 'expo.out'}, 0.7);
            return () => dispose(sequence);
        },
    });
    return <section ref={scope} id="baithak" className="baithak baithak-section" aria-labelledby="baithak-title">
        <div className="baithak-spread">
            <div className="baithak-identity">
                <img data-baithak-mark src="/baithak.svg" alt="Baithak in Shahmukhi calligraphy" width="422" height="246" loading="lazy" />
                <p className="baithak-name">baithak <span>By Echo</span></p>
            </div>
            <div className="baithak-story">
                <h2 id="baithak-title">Some stories belong<br />to all of us.</h2>
                <p>Meet Baithak, a new project by Echo. A place to share and discover Punjab’s folk stories.</p>
                <p>An initiative by Echo to preserve the rich heritage and folklore of Punjab. Stories carried across generations, with a place in the next.</p>
                <BaithakLink>Discover Baithak</BaithakLink>
            </div>
            <div className="baithak-inheritance" aria-hidden="true">
                <span>Passed down.</span><i data-baithak-thread /><span data-baithak-forward>Carried forward.</span>
            </div>
        </div>
    </section>;
}
