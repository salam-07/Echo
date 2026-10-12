// A single local check on visits. No timers, polling, tracking, or backend work.
export const BAITHAK_URL = import.meta.env?.VITE_BAITHAK_URL || 'https://baithak.echosocial.site';
export const PROMO_INTERVAL = 7 * 24 * 60 * 60 * 1000;
export const promoKey = (userId) => `echo:baithak:v1:${userId || 'guest'}`;
export function isPromoDue(value, now = Date.now()) {
    const timestamp = Number(value);
    return !value || !Number.isFinite(timestamp) || timestamp <= 0 || timestamp > now || now - timestamp >= PROMO_INTERVAL;
}
const visits = new Map();
export function getPromoVisit(userId) {
    const key = promoKey(userId);
    if (!visits.has(key)) {
        let visible = true;
        try { visible = isPromoDue(localStorage.getItem(key)); } catch { /* Session fallback. */ }
        visits.set(key, visible);
    }
    return visits.get(key);
}
export function recordPromo(userId, dismissed = false) {
    if (dismissed) visits.set(promoKey(userId), false);
    try { localStorage.setItem(promoKey(userId), String(Date.now())); } catch { /* Session fallback. */ }
}

export function hidePromoVisit(userId) { visits.set(promoKey(userId), false); }

