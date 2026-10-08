export const Note = ({ className = '', children }) => (
    <p className={`text-[0.8125rem] leading-[1.5] text-ink-quiet ${className}`}>{children}</p>
);

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

export const Field = ({
    id,
    label,
    value,
    onChange,
    onKeyDown,
    onBlur,
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
        <section className="mt-4">
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
                    name={`${slug}-visibility`}
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

export const Clause = ({ name, note, children }) => (
    <section className="mt-8">
        <h2 className="t-label t-label--ink">{name}</h2>
        {note ? <Note className="mt-2">{note}</Note> : null}
        <div className="mt-5">{children}</div>
    </section>
);

export const Actions = ({ label, busyLabel, canSubmit = true, isBusy = false, onCancel }) => (
    <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!canSubmit || isBusy} className="act h-12 px-8">
            {isBusy ? busyLabel : label}
        </button>
        <button type="button" disabled={isBusy} onClick={onCancel} className="act act-quiet h-12 px-6">
            Cancel
        </button>
    </div>
);
