import { useLayoutEffect, useRef } from 'react';

/** Keep a complete name on one line, including after fonts load or the viewport changes. */
export default function NameHeading({ children }) {
    const heading = useRef(null);
    const text = useRef(null);

    useLayoutEffect(() => {
        const element = heading.current;
        let active = true;
        const fit = () => {
            if (!active || !element.clientWidth) return;
            element.style.removeProperty('font-size');
            const size = parseFloat(getComputedStyle(element).fontSize);
            const width = text.current.getBoundingClientRect().width;
            if (width > element.clientWidth) {
                element.style.fontSize = `${size * (element.clientWidth - 1) / width}px`;
            }
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(element);
        window.addEventListener('resize', fit);
        document.fonts.ready.then(fit);
        document.fonts.addEventListener('loadingdone', fit);
        return () => {
            active = false;
            observer.disconnect();
            window.removeEventListener('resize', fit);
            document.fonts.removeEventListener('loadingdone', fit);
        };
    }, [children]);

    return <h1 ref={heading} className="t-page-title t-name-title text-ink"><span ref={text}>{children}</span></h1>;
}
