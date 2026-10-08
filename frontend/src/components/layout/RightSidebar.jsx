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
    const { scrolls, getScrolls, isLoadingScrolls } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const curations = useMemo(
        () => scrolls.filter((scroll) => scroll.type === 'curation').slice(0, 6),
        [scrolls],
    );

    return (
        <aside aria-labelledby="sidebar-curations" className="hidden w-[15.5rem] shrink-0 px-5 py-5 lg:block">
            <div className="flex items-center justify-between gap-3">
                <h2 id="sidebar-curations" className="t-label t-label--ink">Curations</h2>
                {curations.length > 0 && <Link to="/scrolls/curations" aria-label="View all Curations" className="t-label link-rule flex min-h-11 items-center transition-colors hover:text-ink">
                    View all
                </Link>
                }
            </div>

            {curations.length > 0 ? (
                <ul className="mt-1">
                    {curations.map((scroll) => (
                        <li key={scroll._id}>
                            <Link
                                to={`/scroll/${scroll._id}`}
                                className="group flex min-h-11 items-baseline justify-between gap-3 py-3"
                            >
                                <span className="min-w-0 break-words text-[0.875rem] leading-[1.45] text-ink-soft transition-colors group-hover:text-ink">
                                    {scroll.name}
                                </span>
                                {Array.isArray(scroll.echos) && <span className="t-readout shrink-0 text-ink-quiet">
                                    {scroll.echos.length} {scroll.echos.length === 1 ? 'Echo' : 'Echos'}
                                </span>
                                }
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : isLoadingScrolls ? (
                <p role="status" className="mt-3 text-sm text-ink-quiet">Loading Curations…</p>
            ) : (
                <p className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                    Collect Echos you want to keep.
                    <Link to="/scroll/new?type=curation" className="link-rule mt-2 flex min-h-11 items-center text-ink">
                        Create a Curation
                    </Link>
                </p>
            )}

        </aside>
    );
};

export default RightSidebar;
