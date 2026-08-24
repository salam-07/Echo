/**
 * First-run bookkeeping.
 *
 * The welcome sheet is shown once, on the account's first entry, and never forced
 * again — the reader can always re-open it at /welcome, but Echo will not put it
 * in front of them a second time. That single fact is all this file records, keyed
 * by user id so two accounts on one machine do not inherit each other's history.
 *
 * localStorage is the whole store on purpose: the flag guards a piece of interface,
 * not a piece of the record, and it should never survive a trip to the server or
 * block a paint while it is read.
 */

const key = (userId) => `echo:onboarded:${userId}`;

/** Has this account already been through (or dismissed) the welcome sheet? */
export const hasOnboarded = (userId) => {
    if (!userId) return false;
    try {
        return localStorage.getItem(key(userId)) === '1';
    } catch {
        return false;
    }
};

/** Mark the welcome sheet done — on commit or on skip, the outcome is the same. */
export const markOnboarded = (userId) => {
    if (!userId) return;
    try {
        localStorage.setItem(key(userId), '1');
    } catch {
        /* Private mode, quota, a disabled store — none of it is worth a throw here. */
    }
};
