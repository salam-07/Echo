import React, { useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { useNavigate } from 'react-router-dom';

/**
 * Naming a Curation — a Scroll you fill by hand.
 *
 * Visibility is a two-stop rail rather than a switch: a switch is a shape this
 * world does not have, and the rail already exists for every other either/or in
 * the rule builder. The sentence under it says what the held stop means, so the
 * setting is never only a position.
 */
const CurationForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) return;

        try {
            await createScroll({
                name: name.trim(),
                description: description.trim(),
                type: 'curation',
                isPrivate,
            });
            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating curation:', error);
        }
    };

    const canSubmit = name.trim().length > 0 && !isCreatingScroll;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="curation-name" className="t-label t-label--ink block">
                    Name
                </label>
                <input
                    id="curation-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="What are you collecting?"
                    className="field mt-1"
                    maxLength={50}
                    autoFocus
                />
                <p className="t-readout mt-2 text-right text-rule-strong">{name.length}/50</p>
            </div>

            <div className="mt-8">
                <label htmlFor="curation-description" className="t-label t-label--ink block">
                    Description <span className="font-normal normal-case tracking-normal">— optional</span>
                </label>
                <textarea
                    id="curation-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What belongs in it, and what does not"
                    className="field field-sm mt-1 resize-none"
                    rows={2}
                    maxLength={200}
                />
                <p className="t-readout mt-2 text-right text-rule-strong">{description.length}/200</p>
            </div>

            <fieldset className="mt-10">
                <legend className="t-label t-label--ink">Visibility</legend>
                <div className="mt-2 flex border border-rule">
                    {[
                        { value: false, label: 'Public' },
                        { value: true, label: 'Private' },
                    ].map((option, index) => (
                        <label
                            key={option.label}
                            data-held={isPrivate === option.value || undefined}
                            className={`stop t-label h-11 flex-1 ${index > 0 ? 'border-l border-rule' : ''}`}
                        >
                            <input
                                type="radio"
                                name="visibility"
                                className="sr-only"
                                checked={isPrivate === option.value}
                                onChange={() => setIsPrivate(option.value)}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
                <p className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                    {isPrivate
                        ? 'Only you can open this Curation.'
                        : 'Anyone can find this Curation and follow it.'}
                </p>
            </fieldset>

            <button type="submit" disabled={!canSubmit} className="act mt-10 h-12 w-full px-8">
                {isCreatingScroll ? 'Creating' : 'Create Curation'}
            </button>

            <p className="mt-4 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                Once it exists, file echoes into it from the <span className="t-label">Save</span> control on
                any entry.
            </p>
        </form>
    );
};

export default CurationForm;
