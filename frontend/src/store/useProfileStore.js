import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProfileStore = create((set, get) => ({
    // Profile data
    profile: null,
    myProfile: null,
    followers: [],
    following: [],
    userEchos: [],
    userScrolls: [],

    // Pagination data
    followersPagination: null,
    followingPagination: null,
    echosPagination: null,
    scrollsPagination: null,

    // Loading states
    isLoadingProfile: false,
    isLoadingMyProfile: false,
    isLoadingFollowers: false,
    isLoadingFollowing: false,
    isLoadingUserEchos: false,
    isLoadingUserScrolls: false,

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

    // Get user's followers
    getFollowers: async (userId, page = 1, limit = 20) => {
        set({ isLoadingFollowers: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/followers?page=${page}&limit=${limit}`);
            set({
                followers: res.data.followers,
                followersPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error fetching followers:", error);
            toast.error(error.response?.data?.error || "Failed to fetch followers");
        } finally {
            set({ isLoadingFollowers: false });
        }
    },

    // Get user's following
    getFollowing: async (userId, page = 1, limit = 20) => {
        set({ isLoadingFollowing: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/following?page=${page}&limit=${limit}`);
            set({
                following: res.data.following,
                followingPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error fetching following:", error);
            toast.error(error.response?.data?.error || "Failed to fetch following");
        } finally {
            set({ isLoadingFollowing: false });
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

    // Load more followers (for pagination)
    loadMoreFollowers: async (userId, page, limit = 20) => {
        set({ isLoadingFollowers: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/followers?page=${page}&limit=${limit}`);
            const currentFollowers = get().followers;
            set({
                followers: [...currentFollowers, ...res.data.followers],
                followersPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error loading more followers:", error);
            toast.error(error.response?.data?.error || "Failed to load more followers");
        } finally {
            set({ isLoadingFollowers: false });
        }
    },

    // Load more following (for pagination)
    loadMoreFollowing: async (userId, page, limit = 20) => {
        set({ isLoadingFollowing: true });
        try {
            const res = await axiosInstance.get(`/profile/user/${userId}/following?page=${page}&limit=${limit}`);
            const currentFollowing = get().following;
            set({
                following: [...currentFollowing, ...res.data.following],
                followingPagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error loading more following:", error);
            toast.error(error.response?.data?.error || "Failed to load more following");
        } finally {
            set({ isLoadingFollowing: false });
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

    // Clear profile data (useful when navigating away)
    clearProfile: () => {
        set({
            profile: null,
            followers: [],
            following: [],
            userEchos: [],
            userScrolls: [],
            followersPagination: null,
            followingPagination: null,
            echosPagination: null,
            scrollsPagination: null
        });
    },

    // Clear my profile data
    clearMyProfile: () => {
        set({ myProfile: null });
    }
}));
