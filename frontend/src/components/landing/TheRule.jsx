import { Fragment, useEffect, useRef, useState } from 'react';
import { Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, ink, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';
import './TheRule.css';
const ORDER = ['newest first', 'oldest first', 'most liked first'];
const FEEDS = [
    { id: 'creative', names: ['Creative Hours', 'Fresh Eyes', 'The Moodboard'], included: [['design', 'illustration', 'typography'], ['architecture', 'interiors', 'photography']], excluded: [['politics', 'celebrity news', 'sports']], order: 0 },
    { id: 'curious', names: ['Stay Curious', 'The Rabbit Hole', 'Bright Ideas'], included: [['science', 'space', 'nature'], ['technology', 'engineering', 'computing'], ['history', 'philosophy', 'psychology']], excluded: [], order: 2 },
    { id: 'quiet', names: ['Slow Sundays', 'A Quiet Corner', 'Off the Clock'], included: [['books', 'poetry', 'fiction'], ['music', 'jazz', 'classical']], excluded: [['news', 'politics', 'debates'], ['work', 'business', 'finance']], order: 1 },
    { id: 'outside', names: ['Further Afield', 'The Scenic Route', 'Open Roads'], included: [['travel', 'hiking', 'camping'], ['food', 'cooking', 'baking'], ['photography', 'landscapes', 'wildlife']], excluded: [['ads', 'promotions', 'giveaways'], ['sports', 'gaming', 'esports'], ['politics', 'debates', 'news']], order: 0 },
    { id: 'making', names: ['Made by Hand', 'Work in Progress', 'The Workshop'], included: [['craft', 'ceramics', 'woodworking']], excluded: [['ads', 'promotions', 'giveaways']], order: 1 },
];
// The visible sentence uses natural word widths; hidden samples reserve its height.
const RollingWord = ({ options, value }) => (
    <span className="feed-word">
        <span className="feed-word-measure">{options.map((option, index) => <span key={option} data-current={index === value}>{option}</span>)}</span>
        <span className="feed-word-window"><span key={value} className="feed-word-ink">{options[value]}</span></span>
    </span>
);

const Sentence = ({ feed, phase }) => {
    const words = (sets, offset, conjunction) => sets.map((options, i) => (
        <Fragment key={i}>
            {i > 0 ? (i === sets.length - 1 ? ` ${conjunction} ` : ', ') : ''}
            <RollingWord options={options} value={(Math.floor((phase + offset + i) / 2)) % options.length} />
        </Fragment>
    ));
    return (
        <>
            Make a feed called <RollingWord options={feed.names} value={Math.floor(phase / 3) % feed.names.length} />{' '}
            for Echos about {words(feed.included, 0, 'or')}
            {feed.excluded.length > 0 && <>, without {words(feed.excluded, 1, 'or')}</>}
            {', sorted '}<RollingWord options={ORDER} value={(feed.order + Math.floor(phase / 3)) % ORDER.length} />.
        </>
    );
};

const TheRule = () => {
    const scope = useRef(null);
    const [tick, setTick] = useState(0);

    /* Two of the sheet's three verbs. The statement SETS onto its baseline, and
       the stage takes INK — no more, because the stage is already the only thing
       on this page that moves on its own, and a section whose apparatus is
       animating in two directions at once reads as a demo, not a document. The
       stage is held back until the statement above it has landed, so the sentence
       arrives onto a settled page. Nothing here is scrubbed: the reel's own
       clock is the section's motion, and a second one measuring the scroll would
       be a number the reader cannot read. */
    useSectionMotion(scope, {
        full: () => {
            const root = scope.current;

            const title = setLines('[data-title]', {
                root,
                trigger: root,
                delay: 0.3,
                duration: 1.15,
                stagger: 0.14,
            });
            const stage = ink('[data-stage]', {
                delay: 0.95,
                duration: 1,
                y: 12,
                scrollTrigger: enter(root),
            });

            return () => dispose(title, stage);
        },
        calm: () => {
            const tween = inkOnly('[data-title], [data-stage]', {
                duration: 0.5,
                stagger: 0.08,
                scrollTrigger: enter(scope.current),
            });
            return () => dispose(tween);
        },
    });

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        let visible = false;
        let timer;
        const sync = () => {
            window.clearInterval(timer);
            if (visible && !reduced.matches && !document.hidden) {
                timer = window.setInterval(() => setTick(current => current + 1), 1200);
            }
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
        }, { threshold: 0.2 });
        observer.observe(scope.current);
        reduced.addEventListener('change', sync);
        document.addEventListener('visibilitychange', sync);
        return () => {
            observer.disconnect();
            window.clearInterval(timer);
            reduced.removeEventListener('change', sync);
            document.removeEventListener('visibilitychange', sync);
        };
    }, []);

    const active = Math.floor(tick / 6) % FEEDS.length;
    const phase = tick % 6;

    return (
        <section ref={scope} id="rule" aria-labelledby="rule-title" className="feed-preview">
            <Sheet>
                <h2 id="rule-title" data-title className="t-headline feed-preview-title">Build a feed around your interests.</h2>
            </Sheet>
            <div data-stage className="feed-stage" aria-hidden="true">
                {FEEDS.map(feed => <p key={feed.id} className="feed-line feed-stage-measure"><Sentence feed={feed} phase={0} /></p>)}
                {[-1, 0, 1].map(position => {
                    const feed = FEEDS[(active + position + FEEDS.length) % FEEDS.length];
                    return (
                        <div key={position} className="feed-slot" data-position={position}>
                            <p key={feed.id} className="feed-line"><Sentence feed={feed} phase={position === 0 ? phase : 0} /></p>
                        </div>
                    );
                })}
            </div>
            <ul className="sr-only" aria-label="Five example feeds">
                {FEEDS.map(feed => <li key={feed.id}>Make a feed called {feed.names[0]} for Echos about {feed.included.map(tags => tags[0]).join(' or ')}{feed.excluded.length ? `, without ${feed.excluded.map(tags => tags[0]).join(' or ')}` : ''}, {ORDER[feed.order]}.</li>)}
            </ul>
        </section>
    );
};

export default TheRule;
