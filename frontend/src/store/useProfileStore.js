import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useProfileStore = create((set, get) => ({
    // Profile data
    profile: null,
    myProfile: null,
    userEchos: [],
    userScrolls: [],

    // Pagination data
    echosPagination: null,
    scrollsPagination: null,

    // Loading states
    isLoadingProfile: false,
    isLoadingMyProfile: false,
    isLoadingUserEchos: false,
    isLoadingUserScrolls: false,
    isSavingProfile: false,

    // Get any user's profile by ID
    getProfile: async (userId) => {
        set({ isLoadingProfile: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}`);
            set({ profile: res.data });
        } catch (error) {
            console.log("Error fetching profile:", error);
            toast.error(error.response?.data?.error || "Failed to fetch profile");
        } finally {
            set({ isLoadingProfile: false });
        }
    },

    // Get current user's profile
    getMyProfile: async () => {
        set({ isLoadingMyProfile: true });
        try {
            const res = await axiosInstance.get("/profile/me");
            set({ myProfile: res.data });
        } catch (error) {
            console.log("Error fetching my profile:", error);
            toast.error(error.response?.data?.error || "Failed to fetch profile");
        } finally {
            set({ isLoadingMyProfile: false });
        }
    },

    // Update current user's profile (bio). Keeps authUser in sync so the
    // masthead fallback reflects the change without a reload.
    updateMyProfile: async (data) => {
        set({ isSavingProfile: true });
        try {
            const res = await axiosInstance.patch("/profile/me", data);
            set({ myProfile: res.data });
            useAuthStore.getState().updateAuthUser({ bio: res.data.bio });
            toast.success("Saved");
            return res.data;
        } catch (error) {
            console.log("Error updating profile:", error);
            toast.error(error.response?.data?.error || "Failed to save");
        } finally {
            set({ isSavingProfile: false });
        }
    },

    // Get user's echos
    getUserEchos: async (userId, page = 1, limit = 10) => {
        set({ isLoadingUserEchos: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/echos?page=${page}&limit=${limit}`);
            set({
                userEchos: res.data.echos,
                echosPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error fetching user echos:", error);
            toast.error(error.response?.data?.error || "Failed to fetch echos");
        } finally {
            set({ isLoadingUserEchos: false });
        }
    },

    // Get user's scrolls (created or saved)
    getUserScrolls: async (userId, type = "created", page = 1, limit = 10) => {
        set({ isLoadingUserScrolls: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/scrolls?type=${type}&page=${page}&limit=${limit}`);
            set({
                userScrolls: res.data.scrolls,
                scrollsPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error fetching user scrolls:", error);
            toast.error(error.response?.data?.error || "Failed to fetch scrolls");
        } finally {
            set({ isLoadingUserScrolls: false });
        }
    },

    // Load more echos (for pagination)
    loadMoreEchos: async (userId, page, limit = 10) => {
        set({ isLoadingUserEchos: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/echos?page=${page}&limit=${limit}`);
            const currentEchos = get().userEchos;
            set({
                userEchos: [...currentEchos, ...res.data.echos],
                echosPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error loading more echos:", error);
            toast.error(error.response?.data?.error || "Failed to load more echos");
        } finally {
            set({ isLoadingUserEchos: false });
        }
    },

    // Load more scrolls (for pagination)
    loadMoreScrolls: async (userId, type = "created", page, limit = 10) => {
        set({ isLoadingUserScrolls: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/scrolls?type=${type}&page=${page}&limit=${limit}`);
            const currentScrolls = get().userScrolls;
            set({
                userScrolls: [...currentScrolls, ...res.data.scrolls],
                scrollsPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error loading more scrolls:", error);
            toast.error(error.response?.data?.error || "Failed to load more scrolls");
        } finally {
            set({ isLoadingUserScrolls: false });
        }
    },

    // Update scroll's savedBy in user scrolls
    updateScrollSavedBy: (scrollId, userId, isFollowing) => {
        const { userScrolls } = get();
        set({
            userScrolls: userScrolls.map(s => {
                if (s._id === scrollId) {
                    const savedBy = s.savedBy || [];
                    return {
                        ...s,
                        savedBy: isFollowing
                            ? [...savedBy, userId]
                            : savedBy.filter(id => id !== userId)
                    };
                }
                return s;
            })
        });
    },

    // Clear profile data (useful when navigating away)
    clearProfile: () => {
        set({
            profile: null,
            userEchos: [],
            userScrolls: [],
            echosPagination: null,
            scrollsPagination: null
        });
    },

    // Clear my profile data
    clearMyProfile: () => {
        set({ myProfile: null });
    }
}));
