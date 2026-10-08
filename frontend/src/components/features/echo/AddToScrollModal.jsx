import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../../../store/useScrollStore';
import useAuthStore from '../../../store/useAuthStore';
import { Modal } from '../../ui';

/**
 * Filing an entry into a Curation — the collections you keep by hand, as opposed
 * to the Feeds a rule fills for you. Only your own Curations are offered, because
 * only they are yours to add to.
 *
 * Selection is inversion, as everywhere else in the document. Filing is confirmed
 * where it happens: the chosen shelf reads `Filed`, and the sheet lifts a beat
 * later — the certainty of an entry pressed into a ledger, not a celebration. Each
 * shelf carries its running tally on the right, so you file into a known place.
 */
const AddToScrollModal = ({ echoId, onClose }) => {
    const { scrolls, getScrolls, addEchoToCuration } = useScrollStore();
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const [selectedScrollId, setSelectedScrollId] = useState('');
    // idle → filing → filed. `filed` holds the confirmation on screen for a beat
    // before the sheet lifts; a failure drops back to idle and prints the recovery
    // line beneath the list.
    const [phase, setPhase] = useState('idle');
    const [error, setError] = useState(null);
    const liftTimer = useRef(null);

    const curationScrolls = scrolls.filter(
        (scroll) => scroll.type === 'curation' && scroll.creator?._id === authUser?._id,
    );

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    useEffect(() => () => clearTimeout(liftTimer.current), []);

    const handleAdd = async () => {
        if (!selectedScrollId || phase !== 'idle') return;
        setError(null);
        setPhase('filing');
        try {
            await addEchoToCuration(selectedScrollId, echoId);
            setPhase('filed');
            liftTimer.current = setTimeout(() => onClose(), 850);
        } catch (err) {
            console.log('Error adding to scroll:', err);
            setPhase('idle');
            setError('Couldn’t save this Echo. Try again.');
        }
    };

    const primaryLabel = phase === 'filed' ? 'Saved' : phase === 'filing' ? 'Saving…' : 'Save Echo';

    return (
        <Modal isOpen onClose={onClose} title="Save to a Curation" size="sm">
            {curationScrolls.length === 0 ? (
                <Modal.Body>
                    <p className="t-body text-ink-soft">
                        Create a Curation to collect Echos you choose.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            navigate('/scroll/new?type=curation');
                        }}
                        className="act mt-6 h-11 px-6"
                    >
                        Create a Curation
                    </button>
                </Modal.Body>
            ) : (
                <>
                    <ul className="max-h-72 overflow-y-auto">
                        {curationScrolls.map((scroll) => {
                            const held = selectedScrollId === scroll._id;
                            const filed = phase === 'filed' && held;
                            const count = Array.isArray(scroll.echos) ? scroll.echos.length : null;
                            return (
                                <li key={scroll._id} className="border-b border-rule last:border-b-0">
                                    <button
                                        type="button"
                                        aria-pressed={held}
                                        aria-disabled={phase !== 'idle' || undefined}
                                        data-held={held || undefined}
                                        onClick={() => phase === 'idle' && setSelectedScrollId(scroll._id)}
                                        className="stop w-full flex-col items-start gap-1 px-6 py-4 text-left"
                                    >
                                        <span className="flex w-full items-baseline justify-between gap-4">
                                            <span className="text-[0.9375rem] font-medium">{scroll.name}</span>
                                            {filed ? (
                                                <span className="t-readout shrink-0 text-paper">Saved</span>
                                            ) : count != null ? (
                                                <span
                                                    className={`t-readout shrink-0 ${held ? 'text-chalk-quiet' : 'text-ink-quiet'}`}
                                                >
                                                    {count}
                                                </span>
                                            ) : null}
                                        </span>
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

                    {error && (
                        <p role="alert" className="t-readout px-6 pt-4 text-alarm">
                            {error}
                        </p>
                    )}

                    <Modal.Footer>
                        <button type="button" onClick={onClose} className="act act-quiet h-11 px-4">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!selectedScrollId || phase !== 'idle'}
                            aria-live="polite"
                            className="act h-11 px-6"
                        >
                            {primaryLabel}
                        </button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default AddToScrollModal;
