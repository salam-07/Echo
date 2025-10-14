import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { createAsyncAction, createLoadingStates } from "./utils.js";
import toast from "react-hot-toast";

export const useEchoStore = create((set, get) => ({
    // Echo data
    echos: [],
    echo: null,

    // Loading states - using utility
    ...createLoadingStates('echo', ['Loading', 'Posting', 'Deleting', 'Liking']),

    // Get all echos - using utility
    getAllEchos: createAsyncAction(
        set,
        get,
        'isLoadingEchos',
        async (filters = {}) => {
            const params = new URLSearchParams();
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.user) params.append('user', filters.user);

            const res = await axiosInstance.get(`/echo/all?${params.toString()}`);
            return res.data;
        },
        {
            onSuccess: (result, set) => {
                set({ echos: result.echos });
            },
            errorMessage: "Failed to fetch echos"
        }
    ),

    // Get paginated echos
    getPaginatedEchos: async (page = 1, limit = 10, filters = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (filters.tag) params.append('tag', filters.tag);
        if (filters.user) params.append('user', filters.user);

        const res = await axiosInstance.get(`/echo/all?${params.toString()}`);
        return {
            echos: res.data.echos,
            hasMore: res.data.hasMore || res.data.echos.length === limit,
            total: res.data.total
        };
    },

    // Get single echo by ID
    getEcho: async (echoId) => {
        set({ isLoadingEcho: true });
        try {
            const res = await axiosInstance.get(`/echo/echo/${echoId}`);
            set({ echo: res.data.echo });
        } catch (error) {
            console.log("Error fetching echo:", error);
            toast.error(error.response?.data?.error || "Failed to fetch echo");
        } finally {
            set({ isLoadingEcho: false });
        }
    },

    // Post new echo
    postEcho: async (data) => {
        set({ isPostingEcho: true });
        try {
            const res = await axiosInstance.post("/echo/post", data);

            // Add new echo to the beginning of the echos array
            const { echos } = get();
            set({ echos: [res.data.echo, ...echos] });

            toast.success("Echo posted successfully");
            return res.data.echo;
        } catch (error) {
            console.log("Error posting echo:", error);
            toast.error(error.response?.data?.error || "Failed to post echo");
            throw error;
        } finally {
            set({ isPostingEcho: false });
        }
    },

    // Delete echo
    deleteEcho: async (echoId) => {
        set({ isDeletingEcho: true });
        try {
            await axiosInstance.delete(`/echo/delete/${echoId}`);

            // Remove echo from the echos array
            const { echos } = get();
            set({ echos: echos.filter(echo => echo._id !== echoId) });

            // Also remove from scrollEchos if viewing a scroll
            const { useScrollStore } = await import('./useScrollStore.js');
            const { scrollEchos } = useScrollStore.getState();
            useScrollStore.setState({
                scrollEchos: scrollEchos.filter(echo => echo._id !== echoId)
            });

            toast.success("Echo deleted successfully");
        } catch (error) {
            console.log("Error deleting echo:", error);
            toast.error(error.response?.data?.error || "Failed to delete echo");
            throw error;
        } finally {
            set({ isDeletingEcho: false });
        }
    },

    // Toggle like/unlike echo
    toggleLike: async (echoId) => {
        const { echos, echo } = get();
        // Also check scrollEchos for the current echo
        const { useScrollStore } = await import('./useScrollStore.js');
        const { scrollEchos } = useScrollStore.getState();
        const currentEcho = echos.find(e => e._id === echoId) ||
            scrollEchos.find(e => e._id === echoId) ||
            echo;
        const isCurrentlyLiked = currentEcho?.isLiked;

        try {
            const res = isCurrentlyLiked
                ? await axiosInstance.delete(`/echo/like/${echoId}`)
                : await axiosInstance.post(`/echo/like/${echoId}`);

            // Update both echos array and single echo
            const updateEcho = (e) => e._id === echoId
                ? { ...e, likes: res.data.likes, isLiked: res.data.isLiked }
                : e;

            set({
                echos: echos.map(updateEcho),
                echo: echo && echo._id === echoId
                    ? { ...echo, likes: res.data.likes, isLiked: res.data.isLiked }
                    : echo
            });

            // Also update scrollEchos if they exist (for custom scrolls)
            const { useScrollStore } = await import('./useScrollStore.js');
            useScrollStore.getState().updateScrollEcho(echoId, {
                likes: res.data.likes,
                isLiked: res.data.isLiked
            });
        } catch (error) {
            toast.error("Failed to update like");
        }
    },

    // Get echos by tag
    getEchosByTag: async (tagName, orderBy = 'newest', timeframe = 'all', startDate = null, endDate = null) => {
        set({ isLoadingEchos: true });
        try {
            const params = new URLSearchParams();
            if (orderBy && orderBy !== 'newest') params.append('orderBy', orderBy);
            if (timeframe && timeframe !== 'all') params.append('timeframe', timeframe);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const queryString = params.toString();
            const url = `/echo/tag/${tagName}${queryString ? `?${queryString}` : ''}`;

            const res = await axiosInstance.get(url);
            set({ echos: res.data.echos });
            return res.data;
        } catch (error) {
            console.log("Error fetching echos by tag:", error);
            toast.error(error.response?.data?.error || "Failed to fetch echos");
        } finally {
            set({ isLoadingEchos: false });
        }
    },

    // Clear echo data
    clearEcho: () => set({ echo: null }),

    // Clear all echos
    clearEchos: () => set({ echos: [] }),
}));