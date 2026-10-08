import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../store/useScrollStore';
import { Actions, Identity } from './Sheet';

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
                namePlaceholder="e.g. Words to keep"
                description={description}
                onDescription={setDescription}
                descriptionPlaceholder="What belongs in this collection?"
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
