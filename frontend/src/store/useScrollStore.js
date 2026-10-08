import useAuthStore from './useAuthStore';
import { updateScrollFollowers } from '../lib/scrollFollowers';
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { createLoadingStates } from "./utils.js";
import toast from "react-hot-toast";

const emptyPagination = () => ({ page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false });

/* How long a Feed's first page stays good enough to hand straight to the sheet.
   Long enough that turning the drum back and forth is always instant, short
   enough that a Feed is never showing a day-old page one. Anything that writes
   an Echo invalidates the whole cache, which is the only thing that makes a
   cached page wrong rather than merely old. */
const FEED_CACHE_TTL = 5 * 60 * 1000;
const FEED_CACHE_LIMIT = 8;

/* Page 1, keyed by Feed, as last seen. `savedAt` is the clock the TTL and the
   recency order are both read from. */
const feedCache = new Map();

/* One in-flight guess per Feed, so the same rules are never fetched twice and a
   Feed the reader has actually chosen can call off the guess. */
const prefetching = new Map();

let echoRequest;
let requestVersion = 0;
let sessionVersion = 0;

/** The cached page if it is still good, else nothing — and a stale entry is
 *  dropped where it is found, so the map never holds more than it can serve. */
const readFeedCache = (id) => {
    const cached = feedCache.get(id);
    if (!cached) return null;
    if (Date.now() - cached.savedAt > FEED_CACHE_TTL) {
        feedCache.delete(id);
        return null;
    }
    return cached;
};

/** Write a Feed in, and move it to the young end of the map. */
const rememberFeed = (id, data) => {
    feedCache.delete(id);
    feedCache.set(id, { ...data, savedAt: Date.now() });
    if (feedCache.size > FEED_CACHE_LIMIT) feedCache.delete(feedCache.keys().next().value);
};

/** Move a Feed to the young end without touching its clock. Reading a cached
 *  page must not extend its life: a Feed the reader keeps turning back to would
 *  otherwise never age out, and the cache would slowly fill with pages the TTL
 *  was written to retire. Only a fresh response re-stamps `savedAt`. */
const touchFeed = (id) => {
    const cached = feedCache.get(id);
    if (!cached) return;
    feedCache.delete(id);
    feedCache.set(id, cached);
};

export const useScrollStore = create((set, get) => ({
    // Scroll data
    scrolls: [],
    hasLoadedScrolls: false,
    scrollsError: null,
    scroll: null,
    scrollEchos: [],
    selectedScroll: null,
    scrollEchosId: null,
    scrollEchosError: null,
    scrollEchosRetryReset: true,
    feedSwitchDirection: 1,

    // Pagination state for scroll echos
    scrollEchoPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false
    },

    // Loading states - using utility
    ...createLoadingStates('scroll', ['Loading', 'Creating', 'Deleting']),
    isLoadingScrollEchos: false,

    // Set selected scroll
    setSelectedScroll: (scroll) => {
        if (get().selectedScroll?._id === scroll?._id) return;
        const feeds = get().scrolls.filter(item => item.type === 'feed');
        const previous = feeds.findIndex(item => item._id === get().selectedScroll?._id);
        const next = feeds.findIndex(item => item._id === scroll?._id);
        const feedSwitchDirection = next < previous ? -1 : 1;

        if (!scroll) {
            localStorage.removeItem('selectedScrollId');
            set({ selectedScroll: null, feedSwitchDirection });
            return;
        }

        localStorage.setItem('selectedScrollId', scroll._id);

        /* A Feed already in the pocket is handed over in the same breath as the
           choice, id and contents together, so the sheet has the right Echos on
           the very first frame it draws. Without this the selection commits one
           render ahead of its contents and the reader sees a skeleton drop
           between two Feeds — the flash that makes a switch feel slow even when
           nothing is slow. Page one is the whole of what a switch needs: the
           rest of the Feed is fetched when the reader asks for it. */
        const cached = readFeedCache(scroll._id);
        if (cached) {
            prefetching.get(scroll._id)?.abort();
            prefetching.delete(scroll._id);
            touchFeed(scroll._id);
            set({
                selectedScroll: scroll,
                feedSwitchDirection,
                scrollEchosId: scroll._id,
                scrollEchos: cached.echos,
                scrollEchoPagination: cached.pagination,
                scrollEchosError: null,
                isLoadingScrollEchos: false,
            });
            return;
        }

        set({ selectedScroll: scroll, feedSwitchDirection });
    },

    // Create a new scroll
    createScroll: async (data) => {
        set({ isCreatingScroll: true });
        try {
            const res = await axiosInstance.post("/scroll/create", data);
            const { scrolls } = get();
            set({ scrolls: [res.data.scroll, ...scrolls] });
            toast.success("Scroll created successfully");
            return res.data.scroll;
        } catch (error) {
            console.log("Error creating scroll:", error);
            toast.error(error.response?.data?.error || "Failed to create scroll");
            throw error;
        } finally {
            set({ isCreatingScroll: false });
        }
    },

    // Get all user's scrolls
    getScrolls: async () => {
        if (get().isLoadingScrolls) return;
        const session = sessionVersion;
        set({ isLoadingScrolls: true, scrollsError: null });
        try {
            const res = await axiosInstance.get("/scroll/all");
            if (session !== sessionVersion) return;
            set({ scrolls: res.data.scrolls, hasLoadedScrolls: true });

            // Restore selected scroll from localStorage
            const savedScrollId = localStorage.getItem('selectedScrollId');
            if (savedScrollId && !get().selectedScroll) {
                const savedScroll = res.data.scrolls.find(s => s._id === savedScrollId);
                if (savedScroll && savedScroll.type === 'feed') {
                    get().setSelectedScroll(savedScroll);
                }
            }
        } catch (error) {
            if (session !== sessionVersion) return;
            console.log("Error fetching scrolls:", error);
            set({ scrollsError: 'Couldn’t load your Feeds. Please try again.' });
            toast.error(error.response?.data?.error || "Failed to fetch scrolls");
        } finally {
            if (session === sessionVersion) set({ isLoadingScrolls: false });
        }
    },

    // Get single scroll by ID
    getScrollById: async (scrollId) => {
        set({ isLoadingScroll: true });
        try {
            const res = await axiosInstance.get(`/scroll/${scrollId}`);
            set({ scroll: res.data.scroll });
            return res.data.scroll;
        } catch (error) {
            console.log("Error fetching scroll:", error);
            toast.error(error.response?.data?.error || "Failed to fetch scroll");
        } finally {
            set({ isLoadingScroll: false });
        }
    },

    // Delete scroll
    deleteScroll: async (scrollId) => {
        set({ isDeletingScroll: true });
        try {
            await axiosInstance.delete(`/scroll/${scrollId}`);
            feedCache.delete(scrollId);
            const { scrolls, selectedScroll } = get();
            set({ scrolls: scrolls.filter(scroll => scroll._id !== scrollId) });

            // Clear selected scroll if it was deleted
            if (selectedScroll?._id === scrollId) {
                set({ selectedScroll: null });
                localStorage.removeItem('selectedScrollId');
            }

            toast.success("Scroll deleted successfully");
        } catch (error) {
            console.log("Error deleting scroll:", error);
            toast.error(error.response?.data?.error || "Failed to delete scroll");
            throw error;
        } finally {
            set({ isDeletingScroll: false });
        }
    },

    // Add echo to curation scroll
    addEchoToCuration: async (scrollId, echoId) => {
        try {
            const res = await axiosInstance.post(`/scroll/${scrollId}/add-echo`, { echoId });
            feedCache.delete(scrollId);
            toast.success("Echo added to scroll");
            return res.data.scroll;
        } catch (error) {
            console.log("Error adding echo to scroll:", error);
            toast.error(error.response?.data?.error || "Failed to add echo");
            throw error;
        }
    },

    // Remove echo from curation scroll
    removeEchoFromCuration: async (scrollId, echoId) => {
        try {
            const res = await axiosInstance.delete(`/scroll/${scrollId}/remove-echo/${echoId}`);
            feedCache.delete(scrollId);
            toast.success("Echo removed from scroll");
            return res.data.scroll;
        } catch (error) {
            console.log("Error removing echo from scroll:", error);
            toast.error(error.response?.data?.error || "Failed to remove echo");
            throw error;
        }
    },

    // Get echos from a scroll (works for both curation and feed)
    getScrollEchos: async (scrollId, reset = true, useCache = false) => {
        echoRequest?.abort();
        const version = ++requestVersion;

        /* A Feed the reader has actually chosen is no longer a Feed worth
           guessing at; the guess would only race the request it is guessing for. */
        prefetching.get(scrollId)?.abort();
        prefetching.delete(scrollId);

        const cached = reset && useCache ? readFeedCache(scrollId) : null;
        if (cached) {
            touchFeed(scrollId);
            set({ scrollEchosId: scrollId, scrollEchos: cached.echos,
                scrollEchoPagination: cached.pagination, scrollEchosError: null, isLoadingScrollEchos: false });
            return cached.echos;
        }
        const controller = new AbortController();
        echoRequest = controller;
        const previous = get();
        const sameFeed = previous.scrollEchosId === scrollId;
        const existing = sameFeed ? previous.scrollEchos : [];
        const pagination = sameFeed ? previous.scrollEchoPagination : emptyPagination();
        set({ isLoadingScrollEchos: true, scrollEchosId: scrollId, scrollEchosError: null,
            scrollEchos: existing, scrollEchoPagination: pagination });
        try {
            const page = reset ? 1 : pagination.page + 1;

            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pagination.limit.toString());

            const res = await axiosInstance.get(`/scroll/${scrollId}/echos?${params.toString()}`, {
                signal: controller.signal, timeout: 15000,
            });
            if (version !== requestVersion) return;
            const echos = reset ? res.data.echos : [...new Map(
                [...get().scrollEchos, ...res.data.echos].map(echo => [echo._id, echo]),
            ).values()];
            rememberFeed(scrollId, { echos, pagination: res.data.pagination });

            set({
                scrollEchos: echos,
                scrollEchoPagination: res.data.pagination
            });

            return res.data.echos;
        } catch {
            if (version !== requestVersion || controller.signal.aborted) return;
            set({ scrollEchosError: 'Couldn’t load this Feed. Please try again.', scrollEchosRetryReset: reset });
        } finally {
            if (version === requestVersion) {
                echoRequest = null;
                set({ isLoadingScrollEchos: false });
            }
        }
    },

    // Load more scroll echos (for infinite scrolling)
    loadMoreScrollEchos: async (scrollId) => {
        const { scrollEchoPagination, isLoadingScrollEchos } = get();

        // Don't load if already loading or no more items
        if (get().scrollEchosId !== scrollId || get().scrollEchosError || isLoadingScrollEchos || !scrollEchoPagination.hasMore) {
            return;
        }

        await get().getScrollEchos(scrollId, false);
    },

    /* Guess a Feed's first page before the reader asks for it, so that asking is
       instant. The guess is kept entirely in the pocket — it never touches the
       live sheet, never sets a loading flag, and never raises a toast. A guess
       that misses (offline, a Feed since deleted, a session that has turned
       over) is simply not cached; the Feed fetches itself for real the moment it
       is chosen, exactly as it would have without this. */
    prefetchFeed: async (scrollId) => {
        if (!scrollId || prefetching.has(scrollId)) return;
        if (readFeedCache(scrollId)) return;
        if (get().scrollEchosId === scrollId) return;

        const controller = new AbortController();
        const session = sessionVersion;
        prefetching.set(scrollId, controller);

        try {
            const params = new URLSearchParams({ page: '1', limit: '20' });
            const res = await axiosInstance.get(`/scroll/${scrollId}/echos?${params.toString()}`, {
                signal: controller.signal, timeout: 15000,
            });
            if (session !== sessionVersion || controller.signal.aborted) return;
            rememberFeed(scrollId, { echos: res.data.echos, pagination: res.data.pagination });
        } catch {
            /* nothing to report: this was never a request the reader made */
        } finally {
            if (prefetching.get(scrollId) === controller) prefetching.delete(scrollId);
        }
    },

    /* One at a time, and not until the browser is idle. The first screen is what
       the reader is waiting for; these are only ever for a turn that has not
       happened yet, so they yield to everything else on the page. */
    prefetchFeeds: (feeds = []) => {
        const queue = feeds.filter((feed) => feed?._id).map((feed) => feed._id);
        if (queue.length === 0) return;

        const idle = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
            ? (fn) => window.requestIdleCallback(fn, { timeout: 2000 })
            : (fn) => setTimeout(fn, 300);

        const step = (i) => {
            if (i >= queue.length) return;
            idle(() => { get().prefetchFeed(queue[i]).finally(() => step(i + 1)); });
        };

        step(0);
    },

    // Update a specific echo in scrollEchos (for likes, etc.)
    updateScrollEcho: (echoId, updates) => {
        for (const cached of feedCache.values()) {
            cached.echos = cached.echos.map(echo => echo._id === echoId ? { ...echo, ...updates } : echo);
        }
        const { scrollEchos } = get();
        set({
            scrollEchos: scrollEchos.map(echo =>
                echo._id === echoId ? { ...echo, ...updates } : echo
            )
        });
    },

    clearFeedCache: () => {
        echoRequest?.abort();
        prefetching.forEach((controller) => controller.abort());
        prefetching.clear();
        requestVersion += 1;
        sessionVersion += 1;
        feedCache.clear();
        set({ scrolls: [], hasLoadedScrolls: false, isLoadingScrolls: false, scrollsError: null, selectedScroll: null, scrollEchosId: null, scrollEchos: [],
            scrollEchoPagination: emptyPagination(), scrollEchosError: null, isLoadingScrollEchos: false });
    },

    /* Something was written. Every cached page is now a page that is missing an
       Echo, and a guess in flight is a guess about a corpus that no longer
       exists — both go. */
    invalidateFeedCache: () => {
        prefetching.forEach((controller) => controller.abort());
        prefetching.clear();
        feedCache.clear();
    },

    // Helper to update scroll's savedBy in all relevant state
    updateScrollSavedBy: (scrollId, userId, isFollowing) => {
        const { scrolls, scroll } = get();

        // Update scrolls array
        set({
            scrolls: scrolls.map(s => {
                if (s._id === scrollId) {
                    const savedBy = s.savedBy || [];
                    return {
                        ...s,
                        savedBy: updateScrollFollowers(savedBy, userId, isFollowing)
                    };
                }
                return s;
            })
        });

        // Update current scroll if viewing it
        if (scroll?._id === scrollId) {
            const savedBy = scroll.savedBy || [];
            set({
                scroll: {
                    ...scroll,
                    savedBy: updateScrollFollowers(savedBy, userId, isFollowing)
                }
            });
        }
    },

    // Follow a scroll
    followScroll: async (scrollId) => {
        // Get user ID from auth store
        const { authUser } = useAuthStore.getState();
        const userId = authUser?._id;

        // Optimistic update
        if (userId) {
            get().updateScrollSavedBy(scrollId, userId, true);
        }

        try {
            const res = await axiosInstance.post(`/scroll/${scrollId}/follow`);

            // Refresh scrolls list to include the new followed scroll
            get().getScrolls();

            toast.success("Scroll followed!");
            return res.data;
        } catch (error) {
            // Revert optimistic update on error
            if (userId) {
                get().updateScrollSavedBy(scrollId, userId, false);
            }
            console.log("Error following scroll:", error);
            toast.error(error.response?.data?.error || "Failed to follow scroll");
            throw error;
        }
    },

    // Unfollow a scroll
    unfollowScroll: async (scrollId) => {
        // Get user ID from auth store
        const { authUser } = useAuthStore.getState();
        const userId = authUser?._id;

        // Optimistic update
        if (userId) {
            get().updateScrollSavedBy(scrollId, userId, false);
        }

        try {
            const res = await axiosInstance.delete(`/scroll/${scrollId}/follow`);

            // Refresh scrolls list to reflect changes
            get().getScrolls();

            toast.success("Scroll unfollowed!");
            return res.data;
        } catch (error) {
            // Revert optimistic update on error
            if (userId) {
                get().updateScrollSavedBy(scrollId, userId, true);
            }
            console.log("Error unfollowing scroll:", error);
            toast.error(error.response?.data?.error || "Failed to unfollow scroll");
            throw error;
        }
    },
}));
