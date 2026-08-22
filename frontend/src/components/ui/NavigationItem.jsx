import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * One line of the index. The document's own addressing system on the left, the
 * name of the sheet on the right, and when you are on that sheet the whole line
 * is inverted to solid ink — the only emphasis device this world has.
 *
 * `NavLink` decides held, so no consumer reads the location. There is no icon:
 * a printed index names its sections.
 */
const NavigationItem = ({ to, end = false, reference, children, onNavigate }) => (
    <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
            [
                't-label flex min-h-11 items-center gap-3 px-3 transition-colors duration-200',
                isActive
                    ? 'bg-ink text-paper'
                    : 'text-ink-quiet hover:bg-paper-dim hover:text-ink',
            ].join(' ')
        }
    >
        {({ isActive }) => (
            <>
                {reference ? (
                    <span className={`w-7 shrink-0 ${isActive ? 'text-chalk-quiet' : 'text-rule-strong'}`}>
                        {reference}
                    </span>
                ) : null}
                <span className="truncate">{children}</span>
            </>
        )}
    </NavLink>
);

export default NavigationItem;
