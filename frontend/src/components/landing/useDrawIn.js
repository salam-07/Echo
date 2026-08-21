import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The page's one authored motion: the drawing draws itself.
 *
 * Every rule, dimension, leader and printed border on a sheet derives its
 * extension from a single inherited `--draw` value, so a sheet arrives the way
 * a drafter lays it down — one pass of the straightedge — rather than as eight
 * separate section fades. Content never animates: it is on the paper already.
 *
 * The CSS default is the drawn state, so a sheet is complete with no script at
 * all; this hook only takes the value down to zero when it is going to animate.
 */
export const useDrawIn = (ref, { start = 'top 80%', duration = 1.2 } = {}) => {
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { '--draw': 0 },
                {
                    '--draw': 1,
                    duration,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: el, start, once: true },
                }
            );
        }, el);

        return () => ctx.revert();
    }, [ref, start, duration]);
};

export default useDrawIn;
