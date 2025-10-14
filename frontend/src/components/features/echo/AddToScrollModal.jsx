import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useScrollStore } from '../../../store/useScrollStore';
import useAuthStore from '../../../store/useAuthStore';

const AddToScrollModal = ({ echoId, onClose }) => {
    const { scrolls, getScrolls, addEchoToCuration } = useScrollStore();
    const { authUser } = useAuthStore();
    const [selectedScrollId, setSelectedScrollId] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Filter only curation type scrolls that the current user owns
    const curationScrolls = scrolls.filter(scroll =>
        scroll.type === 'curation' && scroll.creator._id === authUser?._id
    );

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const handleAdd = async () => {
        if (!selectedScrollId) return;

        setIsAdding(true);
        try {
            await addEchoToCuration(selectedScrollId, echoId);
            onClose();
        } catch (error) {
            console.log('Error adding to scroll:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-lg max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-base-content">
                        Add to Scroll
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-base-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                {curationScrolls.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-base-content/60 mb-4">
                            You don't have any curation scrolls yet.
                        </p>
                        <button
                            onClick={() => {
                                onClose();
                                window.location.href = '/scroll/new';
                            }}
                            className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Create Curation
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                            {curationScrolls.map((scroll) => (
                                <button
                                    key={scroll._id}
                                    onClick={() => setSelectedScrollId(scroll._id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedScrollId === scroll._id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-base-300 hover:border-base-400 hover:bg-base-200/50'
                                        }`}
                                >
                                    <div className="font-medium text-base-content">
                                        {scroll.name}
                                    </div>
                                    {scroll.description && (
                                        <div className="text-xs text-base-content/60 mt-1">
                                            {scroll.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!selectedScrollId || isAdding}
                                className="flex-1 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isAdding ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddToScrollModal;
