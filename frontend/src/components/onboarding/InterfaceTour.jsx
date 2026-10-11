import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOUR_STEPS, hasSeenTour, markTourSeen } from '../../lib/interfaceTour';
import './InterfaceTour.css';

const TOTAL_GROUPS = Math.max(...TOUR_STEPS.map((step) => step.group));

// Lives above the routes: moving between pages must not reset the tour.
export default function InterfaceTour({ userId }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [index, setIndex] = useState(null);
    const [visited, setVisited] = useState(new Set());
    const panel = useRef(null);
    const heading = useRef(null);
    const returnFocus = useRef(null);
    const step = index === null ? null : TOUR_STEPS[index];
    const arrived = step?.destination && location.pathname === step.destination;
    const canContinue = !step?.destination || arrived || visited.has(index);

    const start = useCallback(() => {
        returnFocus.current = document.activeElement;
        setVisited(new Set());
        setIndex(0);
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        if (location.pathname === '/' && index === null && !hasSeenTour(userId)) start();
    }, [location.pathname, index, userId, start]);

    const close = useCallback(() => {
        markTourSeen(userId);
        setIndex(null);
        if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
        else {
            const title = document.querySelector('main h1');
            if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
        }
    }, [userId]);

    useEffect(() => {
        if (!step) return;
        const escape = (event) => { if (event.key === 'Escape') close(); };
        document.addEventListener('keydown', escape);
        document.body.classList.add('interface-tour-active');
        return () => {
            document.removeEventListener('keydown', escape);
            document.body.classList.remove('interface-tour-active');
        };
    }, [step, close]);

    useEffect(() => {
        if (arrived) setVisited((current) => new Set([...current, index]));
    }, [arrived, index]);

    useLayoutEffect(() => {
        if (!step) return;
        const element = panel.current;
        const measure = () => document.documentElement.style.setProperty('--tour-height', `${element?.offsetHeight || 0}px`);
        measure();
        const observer = new ResizeObserver(measure);
        if (element) observer.observe(element);
        const frame = requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            document.documentElement.style.removeProperty('--tour-height');
        };
    }, [step, arrived]);

    if (!step || location.pathname === '/welcome') return null;

    const go = (next) => {
        if (next === TOUR_STEPS.length) { close(); return; }
        setIndex(next);
        const nextStep = TOUR_STEPS[next];
        navigate(visited.has(next) && nextStep.destination ? nextStep.destination : nextStep.path);
    };

    return <section ref={panel} className="interface-tour" role="dialog" aria-modal="false" aria-labelledby="tour-title" aria-describedby="tour-copy">
            <div className="interface-tour-topline">
                <span>Step {step.group} of {TOTAL_GROUPS}{step.part && ` · Community ${step.part}`}</span>
                <button type="button" onClick={close}>Skip tour</button>
            </div>
            <div className="interface-tour-progress" role="progressbar" aria-label="Tour progress" aria-valuemin={0} aria-valuemax={TOUR_STEPS.length} aria-valuenow={index + 1} aria-valuetext={`Step ${step.group} of ${TOTAL_GROUPS}${step.part ? `, Community ${step.part}` : ''}`}>
                <span style={{ transform: `scaleX(${(index + 1) / TOUR_STEPS.length})` }} />
            </div>
            <div key={`${index}-${Boolean(arrived)}`} className="interface-tour-content">
            <h2 id="tour-title" ref={heading} tabIndex={-1}>{step.title}</h2>
            <p id="tour-copy">{arrived ? step.arrived : step.mobileBody ? <>
                <span className="hidden lg:inline">{step.body}</span>
                <span className="lg:hidden">{step.mobileBody}</span>
            </> : step.body}</p>
            {step.destination && !canContinue && <button type="button" className="act act-outline interface-tour-open" onClick={() => navigate(step.destination)}>{step.action}</button>}
            </div>
            <div className="interface-tour-controls">
                <button type="button" className="act act-outline" disabled={index === 0} onClick={() => go(index - 1)}>Back</button>
                <button type="button" className="act" disabled={!canContinue} onClick={() => go(index + 1)}>{index === TOUR_STEPS.length - 1 ? 'Finish tour' : 'Next'}</button>
            </div>
            {!canContinue && <p className="interface-tour-hint">{step.action} to continue, or skip the tour.</p>}
        </section>;
}
