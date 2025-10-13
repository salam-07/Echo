import { create } from 'zustand';
import { axiosInstance as axios } from '../lib/axios';

const useCommunityStore = create((set, get) => ({
    // State
    feedScrolls: [],
    curationScrolls: [],
    tags: [],
    popularEchos: [],

    isLoadingFeeds: false,
    isLoadingCurations: false,
    isLoadingTags: false,
    isLoadingPopularEchos: false,

    // Actions
    fetchPublicFeedScrolls: async (limit = null) => {
        set({ isLoadingFeeds: true });
        try {
            const response = await axios.get(`/community/scrolls/public/feed${limit ? `?limit=${limit}` : ''}`);
            set({
                feedScrolls: response.data,
                isLoadingFeeds: false
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching public feed scrolls:', error);
            set({ isLoadingFeeds: false });
            return [];
        }
    },

    fetchPublicCurationScrolls: async (limit = null) => {
        set({ isLoadingCurations: true });
        try {
            const response = await axios.get(`/community/scrolls/public/curation${limit ? `?limit=${limit}` : ''}`);
            set({
                curationScrolls: response.data,
                isLoadingCurations: false
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching public curation scrolls:', error);
            set({ isLoadingCurations: false });
            return [];
        }
    },

    fetchTags: async (limit = null) => {
        set({ isLoadingTags: true });
        try {
            const response = await axios.get(`/community/tags${limit ? `?limit=${limit}` : ''}`);
            set({
                tags: response.data,
                isLoadingTags: false
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tags:', error);
            set({ isLoadingTags: false });
            return [];
        }
    },

    fetchPopularEchos: async (limit = null) => {
        set({ isLoadingPopularEchos: true });
        try {
            const response = await axios.get(`/community/echos/popular${limit ? `?limit=${limit}` : ''}`);
            set({
                popularEchos: response.data,
                isLoadingPopularEchos: false
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching popular echos:', error);
            set({ isLoadingPopularEchos: false });
            return [];
        }
    },

    // Clear data
    clearCommunityData: () => {
        set({
            feedScrolls: [],
            curationScrolls: [],
            tags: [],
            popularEchos: [],
            isLoadingFeeds: false,
            isLoadingCurations: false,
            isLoadingTags: false,
            isLoadingPopularEchos: false,
        });
    }
}));

export default useCommunityStore;