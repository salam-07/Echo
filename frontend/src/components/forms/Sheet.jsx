/**
 * The furniture both Scroll sheets are built from.
 *
 * A Feed and a Curation are two answers to one question, so their sheets are the
 * same document: they open with the same identity clause, they end in the same
 * row of actions, and every either/or in both of them is the same rail of stops.
 * That much was already true of the rules a reader was meant to learn; this
 * module makes it true of the pages that teach them.
 *
 * What used to differ did so for no reason a reader could see. A Feed's name had
 * a label only a screen reader could hear while a Curation's was printed; a
 * count sat under one field and not another; a Curation's visibility sat last, a
 * Feed's was filed under a clause about something else. None of it was decided —
 * it drifted. Here it is decided once.
 */

/** The one muted sentence under a clause name or under a field. */
export const Note = ({ className = '', children }) => (
    <p className={`text-[0.8125rem] leading-[1.5] text-ink-quiet ${className}`}>{children}</p>
);

/**
 * A rail of stops. One held, always; the held stop is inverted to solid ink and
 * set at weight 600, so held is never carried by colour alone.
 *
 * The rail is laid out as a grid — every stop carrying its own right and bottom
 * hairline, the frame carrying the left and top — rather than as a row of
 * `border-left`s inside one box. A row of left borders is only correct while it
 * stays a row: the moment a rail wraps on a narrow sheet, the stops on the second
 * line are left standing under no roof. There are four stops in "Measured over",
 * and they wrap on a phone.
 *
 * `size` is the row height. The sheet's own first decision is cut taller than the
 * clauses below it, because it is the one that decides what the rest of the page
 * will be.
 */
export const Stops = ({
    legend,
    srLegend,
    options,
    value,
    onChange,
    name,
    size = 'md',
    className = '',
}) => (
    <fieldset className={className}>
        {legend ? (
            <legend className="t-label mb-2">{legend}</legend>
        ) : srLegend ? (
            <legend className="sr-only">{srLegend}</legend>
        ) : null}

        <div className="flex flex-wrap border-l border-t border-rule">
            {options.map((option) => (
                <label
                    key={option.value}
                    data-held={value === option.value || undefined}
                    className={`stop t-label flex-1 whitespace-nowrap border-b border-r border-rule px-4 ${
                        size === 'lg' ? 'h-12' : 'h-11'
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        className="sr-only"
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    </fieldset>
);

/**
 * A field of the sheet: the label above it in the apparatus register, which is
 * the document's own rule for a field, and a single hairline underneath.
 *
 * The count rides at the far end of the label's own line, which is where every
 * other label-and-readout pair in this document sits — the running head, the
 * section head, the register — so measuring a name costs no line of its own.
 *
 * And it is not printed before there is anything to count. A `0/50` is a line
 * that says nothing at all; a `12/50` is a line that says something is filling
 * up. It arrives with the first character and darkens to full ink at the limit,
 * which is the one moment it has something to tell the reader. `rule-strong` was
 * the wrong value for it in any case: it is a hairline colour, 4.3:1 on paper,
 * and this is text.
 *
 * `lead` is the register for the one field on a sheet that is the name of the
 * thing being made.
 */
export const Field = ({
    id,
    label,
    value,
    onChange,
    onKeyDown,
    placeholder,
    maxLength,
    rows = 0,
    type = 'text',
    lead = false,
    autoFocus = false,
    autoComplete = 'off',
}) => {
    const used = value.length;
    const showCount = maxLength != null && used > 0;
    const atLimit = maxLength != null && used >= maxLength;
    const countId = `${id}-count`;
    const multiline = rows > 0;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={id} className="t-label t-label--ink">
                    {label}
                </label>
                {showCount ? (
                    <p
                        id={countId}
                        className={`t-readout ${atLimit ? 'text-ink' : 'text-ink-quiet'}`}
                    >
                        {used}/{maxLength}
                    </p>
                ) : null}
            </div>

            {multiline ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows}
                    autoComplete={autoComplete}
                    className="field field-sm mt-1 resize-none"
                    aria-describedby={showCount ? countId : undefined}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    className={`field ${lead ? '' : 'field-sm'} mt-1`}
                    aria-describedby={showCount ? countId : undefined}
                />
            )}
        </div>
    );
};

/**
 * The clause both sheets open with: what this Scroll is called, what it is for,
 * and who may open it.
 *
 * Visibility belongs here, with the name, rather than among a Feed's terms. It is
 * a property of the Scroll, not of the rule it sets — and a reader deciding who
 * may see the thing they are making should not have to find that switch at the
 * bottom of a six-clause specification, filed under a clause about liked Echoes.
 *
 * It is also the only thing the two sheets share outright. A Curation asks for
 * nothing else: it is a shelf, and a shelf needs a name.
 */
export const Identity = ({
    kind,
    name,
    onName,
    description,
    onDescription,
    isPrivate,
    onVisibility,
    namePlaceholder,
    descriptionPlaceholder,
    nameLimit = 50,
    descriptionLimit = 200,
    autoFocus = false,
}) => {
    const slug = kind.toLowerCase();

    return (
        <section className="mt-10 border-t border-ink pt-6">
            <Field
                id={`${slug}-name`}
                label="Name"
                value={name}
                onChange={onName}
                placeholder={namePlaceholder}
                maxLength={nameLimit}
                lead
                autoFocus={autoFocus}
            />

            <div className="mt-8">
                <Field
                    id={`${slug}-description`}
                    label={
                        <>
                            Description{' '}
                            <span className="font-normal normal-case tracking-normal">
                                — optional
                            </span>
                        </>
                    }
                    value={description}
                    onChange={onDescription}
                    placeholder={descriptionPlaceholder}
                    maxLength={descriptionLimit}
                    rows={2}
                />
            </div>

            <div className="mt-8">
                <Stops
                    legend="Visibility"
                    name="visibility"
                    value={isPrivate ? 'private' : 'public'}
                    onChange={(held) => onVisibility(held === 'private')}
                    options={[
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' },
                    ]}
                />
                <Note className="mt-3">
                    {isPrivate
                        ? `Only you can open this ${kind}.`
                        : `Anyone can find this ${kind} and follow it.`}
                </Note>
            </div>
        </section>
    );
};

/**
 * A clause of the specification: its name on a hairline, the one fact a reader
 * needs before touching the control, and the control.
 *
 * The clause number is gone. Nothing in a rule has to be settled before anything
 * else — the order of these clauses is the order a person thinks in, not a
 * protocol — so numbering them was apparatus pointing at a sequence that was
 * never there. A name on a rule is enough to say where one clause ends.
 */
export const Clause = ({ name, note, children }) => (
    <section className="mt-10 border-t border-rule pt-5">
        <h2 className="t-label t-label--ink">{name}</h2>
        {note ? <Note className="mt-2">{note}</Note> : null}
        <div className="mt-5">{children}</div>
    </section>
);

/**
 * The closing row: one action naming what it makes, and the way out.
 *
 * Both sheets now end the same way, and the same way the Echo composer ends, so
 * the last thing on every writing sheet in this document looks the same. The
 * button names the object it creates — a reader should not have to remember which
 * page they are on to know what pressing it will produce.
 */
export const Actions = ({ label, busyLabel, canSubmit = true, isBusy = false, onCancel }) => (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink pt-6">
        <button type="submit" disabled={!canSubmit || isBusy} className="act h-12 px-8">
            {isBusy ? busyLabel : label}
        </button>
        <button type="button" onClick={onCancel} className="act act-quiet h-12 px-6">
            Cancel
        </button>
    </div>
);
