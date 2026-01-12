import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useSearchStore = create((set, get) => ({
    // Search state
    query: '',
    echos: [],
    feeds: [],
    curations: [],
    users: [],

    // Loading states
    isSearching: false,
    isLoadingMore: false,

    // Pagination for individual searches
    echosPagination: null,
    scrollsPagination: null,

    // Set query
    setQuery: (query) => set({ query }),

    // Unified search (for search page overview)
    searchAll: async (query) => {
        if (!query || query.trim().length < 1) {
            set({ echos: [], feeds: [], curations: [], users: [], query: '' });
            return;
        }

        set({ isSearching: true, query });

        try {
            const res = await axiosInstance.get('/search', {
                params: { q: query, limit: 5 }
            });

            set({
                echos: res.data.echos || [],
                feeds: res.data.feeds || [],
                curations: res.data.curations || [],
                users: res.data.users || [],
                isSearching: false
            });
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
            set({ isSearching: false });
        }
    },

    // Search echos with pagination
    searchEchos: async (query, page = 1) => {
        if (!query || query.trim().length < 1) {
            set({ echos: [], echosPagination: null });
            return;
        }

        const isLoadingMore = page > 1;
        set({ [isLoadingMore ? 'isLoadingMore' : 'isSearching']: true });

        try {
            const res = await axiosInstance.get('/search/echos', {
                params: { q: query, page, limit: 20 }
            });

            set(state => ({
                echos: isLoadingMore
                    ? [...state.echos, ...res.data.echos]
                    : res.data.echos,
                echosPagination: res.data.pagination,
                isSearching: false,
                isLoadingMore: false
            }));
        } catch (error) {
            console.error('Search echos error:', error);
            toast.error('Failed to search echos');
            set({ isSearching: false, isLoadingMore: false });
        }
    },

    // Search scrolls with pagination
    searchScrolls: async (query, type, page = 1) => {
        if (!query || query.trim().length < 1) {
            set({ [type === 'feed' ? 'feeds' : 'curations']: [], scrollsPagination: null });
            return;
        }

        const isLoadingMore = page > 1;
        set({ [isLoadingMore ? 'isLoadingMore' : 'isSearching']: true });

        try {
            const res = await axiosInstance.get('/search/scrolls', {
                params: { q: query, type, page, limit: 20 }
            });

            const key = type === 'feed' ? 'feeds' : 'curations';
            set(state => ({
                [key]: isLoadingMore
                    ? [...state[key], ...res.data.scrolls]
                    : res.data.scrolls,
                scrollsPagination: res.data.pagination,
                isSearching: false,
                isLoadingMore: false
            }));
        } catch (error) {
            console.error('Search scrolls error:', error);
            toast.error('Failed to search scrolls');
            set({ isSearching: false, isLoadingMore: false });
        }
    },

    // Search users with pagination
    searchUsers: async (query, page = 1) => {
        if (!query || query.trim().length < 1) {
            set({ users: [] });
            return;
        }

        set({ isSearching: true });

        try {
            const res = await axiosInstance.get('/search/users', {
                params: { q: query }
            });

            set({
                users: res.data.users || [],
                isSearching: false
            });
        } catch (error) {
            console.error('Search users error:', error);
            toast.error('Failed to search users');
            set({ isSearching: false });
        }
    },

    // Clear search results
    clearSearch: () => set({
        query: '',
        echos: [],
        feeds: [],
        curations: [],
        users: [],
        echosPagination: null,
        scrollsPagination: null
    })
}));
