import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useEchoStore = create((set, get) => ({
    // Echo data
    echos: [],
    echo: null,

    // Loading states
    isLoadingEchos: false,
    isLoadingEcho: false,
    isPostingEcho: false,
    isDeletingEcho: false,

    // Get all echos
    getAllEchos: async (filters = {}) => {
        set({ isLoadingEchos: true });
        try {
            const params = new URLSearchParams();
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.user) params.append('user', filters.user);

            const res = await axiosInstance.get(`/echo/all?${params.toString()}`);
            set({ echos: res.data.echos });
        } catch (error) {
            console.log("Error fetching echos:", error);
            toast.error(error.response?.data?.error || "Failed to fetch echos");
        } finally {
            set({ isLoadingEchos: false });
        }
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

            toast.success("Echo deleted successfully");
        } catch (error) {
            console.log("Error deleting echo:", error);
            toast.error(error.response?.data?.error || "Failed to delete echo");
            throw error;
        } finally {
            set({ isDeletingEcho: false });
        }
    },

    // Clear echo data
    clearEcho: () => set({ echo: null }),

    // Clear all echos
    clearEchos: () => set({ echos: [] }),
}));