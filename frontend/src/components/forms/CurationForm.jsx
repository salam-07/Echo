import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';
import { Actions, Identity } from './Sheet';

/**
 * Naming a Curation — a Scroll you fill by hand.
 *
 * A Curation is a shelf, so there is nothing here to specify: what it is called,
 * what it is for, and who may open it. Every other question a Scroll sheet could
 * ask belongs to a Feed, and asking it here would make the two Scrolls look like
 * one thing with two modes rather than the two different things they are.
 *
 * Which is also why the paragraph that used to sit under the button — explaining
 * how to file Echoes into the Curation you had just made — is gone. It told the
 * reader what to do next on the one part of the sheet they had already finished
 * with, and the sentence at the top of this page already says a shelf holds
 * nothing you have not saved yourself.
 */
const CurationForm = ({ autoFocus = false }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim() || isCreatingScroll) return;

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

    return (
        <form onSubmit={handleSubmit}>
            <Identity
                kind="Curation"
                autoFocus={autoFocus}
                name={name}
                onName={setName}
                namePlaceholder="What are you collecting?"
                description={description}
                onDescription={setDescription}
                descriptionPlaceholder="What belongs in it, and what does not"
                isPrivate={isPrivate}
                onVisibility={setIsPrivate}
            />

            <Actions
                label="Create Curation"
                busyLabel="Creating…"
                canSubmit={name.trim().length > 0}
                isBusy={isCreatingScroll}
                onCancel={() => navigate(-1)}
            />
        </form>
    );
};

export default CurationForm;
