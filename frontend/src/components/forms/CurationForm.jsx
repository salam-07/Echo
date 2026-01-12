import React, { useState } from 'react';
import { useScrollStore } from '../../store/useScrollStore';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Globe } from 'lucide-react';

const CurationForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
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
                type: 'curation',
                isPrivate
            });

            navigate('/scrolls');
        } catch (error) {
            console.log('Error creating curation:', error);
        }
    };

    const canSubmit = name.trim().length > 0 && !isCreatingScroll;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Give your curation a name"
                    className="w-full bg-transparent text-lg text-base-content placeholder:text-base-content/25 border-b border-base-content/10 pb-3 outline-none focus:border-base-content/30 transition-colors"
                    maxLength={50}
                    autoFocus
                />
                <div className="flex justify-end">
                    <span className="text-xs text-base-content/30">{name.length}/50</span>
                </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this curation is about (optional)"
                    className="w-full bg-transparent text-sm text-base-content placeholder:text-base-content/25 border-b border-base-content/10 pb-3 outline-none focus:border-base-content/30 transition-colors resize-none leading-relaxed"
                    rows={2}
                    maxLength={200}
                />
                <div className="flex justify-end">
                    <span className="text-xs text-base-content/30">{description.length}/200</span>
                </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between py-4 border-y border-base-content/5">
                <div className="flex items-center gap-3">
                    {isPrivate ? (
                        <Lock className="w-4 h-4 text-base-content/40" />
                    ) : (
                        <Globe className="w-4 h-4 text-base-content/40" />
                    )}
                    <div>
                        <p className="text-sm text-base-content/80">
                            {isPrivate ? 'Private' : 'Public'}
                        </p>
                        <p className="text-xs text-base-content/40">
                            {isPrivate
                                ? 'Only you can view this curation'
                                : 'Anyone can discover this curation'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${isPrivate ? 'bg-base-content/20' : 'bg-base-content/10'
                        }`}
                >
                    <span className={`absolute top-1 w-4 h-4 bg-base-content rounded-full transition-all ${isPrivate ? 'left-6' : 'left-1'
                        }`} />
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${canSubmit
                        ? 'bg-base-content text-base-100 hover:bg-base-content/90'
                        : 'bg-base-content/5 text-base-content/30 cursor-not-allowed'
                    }`}
            >
                {isCreatingScroll ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Create Curation
                    </>
                )}
            </button>

            {/* Tip */}
            <p className="text-center text-xs text-base-content/30">
                After creating, add echos from any echo's menu
            </p>
        </form>
    );
};

export default CurationForm;
