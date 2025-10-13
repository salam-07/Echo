import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useScrollStore = create((set, get) => ({
    // Scroll data
    scrolls: [],
    scroll: null,
    scrollEchos: [],
    selectedScroll: null,

    // Loading states
    isLoadingScrolls: false,
    isLoadingScroll: false,
    isCreatingScroll: false,
    isDeletingScroll: false,
    isLoadingScrollEchos: false,

    // Set selected scroll
    setSelectedScroll: (scroll) => {
        set({ selectedScroll: scroll });
        if (scroll) {
            localStorage.setItem('selectedScrollId', scroll._id);
        } else {
            localStorage.removeItem('selectedScrollId');
        }
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
        set({ isLoadingScrolls: true });
        try {
            const res = await axiosInstance.get("/scroll/all");
            set({ scrolls: res.data.scrolls });

            // Restore selected scroll from localStorage
            const savedScrollId = localStorage.getItem('selectedScrollId');
            if (savedScrollId) {
                const savedScroll = res.data.scrolls.find(s => s._id === savedScrollId);
                if (savedScroll && savedScroll.type === 'feed') {
                    set({ selectedScroll: savedScroll });
                }
            }
        } catch (error) {
            console.log("Error fetching scrolls:", error);
            toast.error(error.response?.data?.error || "Failed to fetch scrolls");
        } finally {
            set({ isLoadingScrolls: false });
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
            toast.success("Echo removed from scroll");
            return res.data.scroll;
        } catch (error) {
            console.log("Error removing echo from scroll:", error);
            toast.error(error.response?.data?.error || "Failed to remove echo");
            throw error;
        }
    },

    // Get echos from a scroll (works for both curation and feed)
    getScrollEchos: async (scrollId) => {
        set({ isLoadingScrollEchos: true });
        try {
            const res = await axiosInstance.get(`/scroll/${scrollId}/echos`);
            set({ scrollEchos: res.data.echos });
            return res.data.echos;
        } catch (error) {
            console.log("Error fetching scroll echos:", error);
            toast.error(error.response?.data?.error || "Failed to fetch echos");
            set({ scrollEchos: [] });
        } finally {
            set({ isLoadingScrollEchos: false });
        }
    },

    // Update a specific echo in scrollEchos (for likes, etc.)
    updateScrollEcho: (echoId, updates) => {
        const { scrollEchos } = get();
        set({
            scrollEchos: scrollEchos.map(echo =>
                echo._id === echoId ? { ...echo, ...updates } : echo
            )
        });
    },

    // Follow a scroll
    followScroll: async (scrollId) => {
        try {
            const res = await axiosInstance.post(`/scroll/${scrollId}/follow`);

            // Refresh scrolls list to include the new followed scroll
            get().getScrolls();

            toast.success("Scroll followed!");
            return res.data;
        } catch (error) {
            console.log("Error following scroll:", error);
            toast.error(error.response?.data?.error || "Failed to follow scroll");
            throw error;
        }
    },

    // Unfollow a scroll
    unfollowScroll: async (scrollId) => {
        try {
            const res = await axiosInstance.delete(`/scroll/${scrollId}/follow`);

            // Refresh scrolls list to reflect changes
            get().getScrolls();

            toast.success("Scroll unfollowed!");
            return res.data;
        } catch (error) {
            console.log("Error unfollowing scroll:", error);
            toast.error(error.response?.data?.error || "Failed to unfollow scroll");
            throw error;
        }
    },
}));
