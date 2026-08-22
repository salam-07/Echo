import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../../store/useScrollStore';
import useAuthStore from '../../../store/useAuthStore';
import { Modal } from '../../ui';

/**
 * Filing an entry into a Curation — the collections you keep by hand, as opposed
 * to the Feeds a rule fills for you. Only your own Curations are offered, because
 * only they are yours to add to.
 *
 * Selection is inversion, as everywhere else in the document.
 */
const AddToScrollModal = ({ echoId, onClose }) => {
    const { scrolls, getScrolls, addEchoToCuration } = useScrollStore();
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const [selectedScrollId, setSelectedScrollId] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const curationScrolls = scrolls.filter(
        (scroll) => scroll.type === 'curation' && scroll.creator?._id === authUser?._id,
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
        <Modal isOpen onClose={onClose} title="File this echo" size="sm">
            {curationScrolls.length === 0 ? (
                <Modal.Body>
                    <p className="t-body text-ink-soft">
                        You keep no Curations yet. A Curation is a Scroll you fill by hand.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            navigate('/scroll/new');
                        }}
                        className="act mt-6 h-11 px-6"
                    >
                        New Scroll
                    </button>
                </Modal.Body>
            ) : (
                <>
                    <ul className="max-h-72 overflow-y-auto">
                        {curationScrolls.map((scroll) => {
                            const held = selectedScrollId === scroll._id;
                            return (
                                <li key={scroll._id} className="border-b border-rule last:border-b-0">
                                    <button
                                        type="button"
                                        aria-pressed={held}
                                        data-held={held || undefined}
                                        onClick={() => setSelectedScrollId(scroll._id)}
                                        className="stop w-full flex-col items-start gap-1 px-6 py-4 text-left"
                                    >
                                        <span className="text-[0.9375rem] font-medium">{scroll.name}</span>
                                        {scroll.description && (
                                            <span className="text-[0.8125rem] leading-[1.5] opacity-80">
                                                {scroll.description}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <Modal.Footer>
                        <button type="button" onClick={onClose} className="act act-quiet h-11 px-4">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!selectedScrollId || isAdding}
                            className="act h-11 px-6"
                        >
                            {isAdding ? 'Filing' : 'File it'}
                        </button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default AddToScrollModal;
