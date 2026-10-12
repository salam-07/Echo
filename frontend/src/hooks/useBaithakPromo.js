import { useEffect, useState } from 'react';
import { getPromoVisit, hidePromoVisit, promoKey, recordPromo } from '../lib/baithak';

export default function useBaithakPromo(userId, enabled = true) {
    const [visible, setVisible] = useState(() => getPromoVisit(userId));
    useEffect(() => {
        if (visible && enabled) recordPromo(userId);
        const sync = (event) => {
            if (event.key === promoKey(userId) && event.newValue) {
                hidePromoVisit(userId);
                setVisible(false);
            }
        };
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, [userId, visible, enabled]);
    return { visible, dismiss: () => { recordPromo(userId, true); setVisible(false); } };
}
