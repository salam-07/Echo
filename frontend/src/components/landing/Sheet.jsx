import { useRef } from 'react';
import { useDrawIn } from './useDrawIn';

/**
 * A sheet of drawing stock lying on the light table.
 *
 * Everything on this page arrives on one: trimmed paper, a printed border set
 * in from the trim, graph ruling beneath the work, and a title block at the
 * foot carrying the sheet's own identification. The title block is a table of
 * labelled fields, which is where small tracked lettering legitimately belongs
 * — it never appears above a heading.
 */

const Field = ({ name, children, className = '' }) => (
    <div className={`px-4 py-3 ${className}`}>
        <span className="fieldname block">{name}</span>
        <span className="drafted mt-1.5 block text-[0.8125rem] leading-tight text-graphite">{children}</span>
    </div>
);

const Sheet = ({ id, number, title, scale = 'AS SPECIFIED', note, label, children, className = '' }) => {
    const ref = useRef(null);
    useDrawIn(ref);

    return (
        <section
            id={id}
            ref={ref}
            aria-label={label ?? `Sheet ${number} — ${title}`}
            data-sheet={number}
            className="px-3 pb-4 sm:px-5 sm:pb-6 lg:px-8 lg:pb-8"
        >
            <div className={`sheet mx-auto max-w-[1440px] px-5 pb-6 pt-8 sm:px-9 sm:pb-8 sm:pt-12 lg:px-14 lg:pb-10 lg:pt-16 ${className}`}>
                <span className="sheet-border" aria-hidden="true" />

                {children}

                {/* Title block: lower right, as it sits on a real sheet. */}
                <div className="mt-12 sm:mt-16">
                    <div className="rule-h-heavy" />
                    <div className="ml-auto grid max-w-full grid-cols-2 sm:max-w-2xl sm:grid-cols-4">
                        <Field name="Project" className="border-r border-hairline">
                            Echo
                        </Field>
                        <Field name="Sheet title" className="sm:border-r sm:border-hairline">
                            {title}
                        </Field>
                        <Field name="Scale" className="border-r border-t border-hairline sm:border-t-0">
                            {scale}
                        </Field>
                        <Field name="Sheet" className="border-t border-hairline sm:border-t-0">
                            <span className="text-usermark">{number}</span>
                            <span className="text-fieldname"> / 6</span>
                        </Field>
                    </div>
                    {note ? (
                        <>
                            <div className="rule-h" />
                            <p className="typed ml-auto max-w-full px-4 py-2.5 text-[0.6875rem] leading-relaxed text-fieldname sm:max-w-2xl">
                                {note}
                            </p>
                        </>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default Sheet;
