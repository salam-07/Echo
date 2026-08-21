/**
 * Dimension lines. A drawing measures its own empty space, which is what keeps
 * emptiness from reading as an unfinished page: every void here carries a
 * figure. Ticks are the drafter's 45-degree slash, never an arrowhead.
 */

const Slash = ({ tone }) => (
    <span
        aria-hidden="true"
        className={`block h-[9px] w-px shrink-0 rotate-45 ${tone === 'mark' ? 'bg-usermark' : 'bg-graphite'}`}
    />
);

/** A horizontal dimension: figure above a ruled line, slashed at both ends. */
export const DimH = ({ label, tone = 'graphite', className = '' }) => (
    <div className={`relative ${className}`} aria-hidden="true">
        <span
            data-dim
            className={`absolute -top-[9px] left-1/2 -translate-x-1/2 bg-sheet px-2 text-[0.625rem] leading-none ${
                tone === 'mark' ? 'text-usermark' : 'text-fieldname'
            }`}
        >
            {label}
        </span>
        <span className="flex items-center">
            <Slash tone={tone} />
            <span className={`rule-h flex-1 ${tone === 'mark' ? 'bg-usermark' : ''}`} />
            <Slash tone={tone} />
        </span>
    </div>
);

/** A vertical dimension, set in a margin. The figure reads bottom-to-top. */
export const DimV = ({ label, tone = 'graphite', className = '' }) => (
    <div className={`relative flex w-full flex-col items-center ${className}`} aria-hidden="true">
        <Slash tone={tone} />
        <span className="rule-v min-h-6 flex-1" />
        <span
            data-dim
            className={`my-2 whitespace-nowrap bg-sheet py-2 text-[0.625rem] leading-none [writing-mode:vertical-rl] ${
                tone === 'mark' ? 'text-usermark' : 'text-fieldname'
            }`}
            style={{ transform: 'rotate(180deg)' }}
        >
            {label}
        </span>
        <span className="rule-v min-h-6 flex-1" />
        <Slash tone={tone} />
    </div>
);

export default DimH;
