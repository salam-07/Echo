import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';

/**
 * The margin column — notes beside the sheet, not a second navigation.
 *
 * The index column already carries every route, so repeating routes here would
 * spend a whole column saying what is already said two columns left. What only
 * this column says is *contents*: which collections you keep by hand, and how
 * much is in each. The counts are read off the records, never invented.
 *
 * Desktop only. Below `lg` there is no margin to write in, and everything here
 * is reachable from the index.
 */
const RightSidebar = () => {
    const { scrolls, getScrolls } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const curations = useMemo(
        () => scrolls.filter((scroll) => scroll.type === 'curation').slice(0, 6),
        [scrolls],
    );

    return (
        <aside className="hidden w-[15.5rem] shrink-0 px-5 py-6 lg:block">
            <p className="t-label flex items-baseline justify-between gap-3 border-b border-rule pb-2">
                <span>Curations</span>
                <Link to="/scrolls/curations" className="link-rule transition-colors hover:text-ink">
                    All
                </Link>
            </p>

            {curations.length > 0 ? (
                <ul className="mt-1">
                    {curations.map((scroll) => (
                        <li key={scroll._id} className="border-b border-rule/60">
                            <Link
                                to={`/scroll/${scroll._id}`}
                                className="group flex items-baseline justify-between gap-3 py-2.5"
                            >
                                <span className="truncate text-[0.875rem] leading-[1.45] text-ink-soft transition-colors group-hover:text-ink">
                                    {scroll.name}
                                </span>
                                <span className="t-readout shrink-0 text-rule-strong">
                                    {scroll.echos?.length ?? 0}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                    Nothing collected by hand yet.{' '}
                    <Link to="/scroll/new" className="link-rule text-ink">
                        Start a curation
                    </Link>
                    .
                </p>
            )}

            <p className="t-label mt-9 border-b border-rule pb-2">Elsewhere</p>
            <ul className="mt-1">
                {[
                    { to: '/browse/tags', label: 'Tags' },
                    { to: '/browse-community', label: 'Community' },
                    { to: '/browse/popular', label: 'Most liked' },
                ].map((item) => (
                    <li key={item.to} className="border-b border-rule/60">
                        <Link
                            to={item.to}
                            className="block py-2.5 text-[0.875rem] leading-[1.45] text-ink-soft transition-colors hover:text-ink"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default RightSidebar;
