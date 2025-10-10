import React, { useState } from 'react';
import { useScrollStore } from '../store/useScrollStore';
import { useNavigate } from 'react-router-dom';

const CurationForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { createScroll, isCreatingScroll } = useScrollStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {
            await createScroll({
                name: name.trim(),
                description: description.trim(),
                type: 'curation'
            });

            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating curation:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                    Scroll Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Favorite Quotes"
                    className="w-full px-4 py-2.5 bg-base-100 border border-base-300 rounded-lg text-base-content placeholder:text-base-content/40"
                    maxLength={50}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A collection of inspiring quotes..."
                    className="w-full px-4 py-2.5 bg-base-100 border border-base-300 rounded-lg text-base-content placeholder:text-base-content/40 resize-none"
                    rows={3}
                    maxLength={200}
                />
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isCreatingScroll || !name.trim()}
                    className="w-full px-6 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isCreatingScroll ? 'Creating...' : 'Create Curation'}
                </button>
            </div>

            <div className="pt-2 text-sm text-base-content/60">
                <p>💡 Tip: After creating, you can manually add echos to this curation from any echo's menu.</p>
            </div>
        </form>
    );
};

export default CurationForm;
