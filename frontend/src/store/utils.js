import toast from "react-hot-toast";

/**
 * Creates async action handlers with loading states for Zustand stores
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function  
 * @param {string} loadingKey - Key name for loading state (e.g., 'isLoading', 'isCreating')
 * @param {Function} action - Async function to execute
 * @param {Object} options - Configuration options
 */
export const createAsyncAction = (set, get, loadingKey, action, options = {}) => {
    const {
        successMessage,
        errorMessage = "An error occurred",
        onSuccess,
        onError,
        transform
    } = options;

    return async (...args) => {
        set({ [loadingKey]: true });

        try {
            const result = await action(...args);

            if (successMessage) {
                toast.success(successMessage);
            }

            if (onSuccess) {
                onSuccess(result, set, get);
            }

            return transform ? transform(result) : result;
        } catch (error) {
            console.error(`Error in ${loadingKey}:`, error);
            const message = error.response?.data?.error || errorMessage;
            toast.error(message);

            if (onError) {
                onError(error, set, get);
            }

            throw error;
        } finally {
            set({ [loadingKey]: false });
        }
    };
};

/**
 * Creates CRUD operations for a resource
 * @param {string} resourceName - Name of the resource (e.g., 'echo', 'scroll')
 * @param {string} apiEndpoint - Base API endpoint
 * @param {Object} axiosInstance - Axios instance
 */
export const createCrudActions = (resourceName, apiEndpoint, axiosInstance) => {
    const capitalizedName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

    return {
        // Get all items
        [`getAll${capitalizedName}s`]: (set, get) =>
            createAsyncAction(
                set,
                get,
                `isLoading${capitalizedName}s`,
                async (filters = {}) => {
                    const params = new URLSearchParams();
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value) params.append(key, value);
                    });

                    const res = await axiosInstance.get(`${apiEndpoint}/all?${params.toString()}`);
                    return res.data;
                },
                {
                    onSuccess: (result, set) => {
                        set({ [`${resourceName}s`]: result[`${resourceName}s`] || result });
                    }
                }
            ),

        // Get single item
        [`get${capitalizedName}`]: (set, get) =>
            createAsyncAction(
                set,
                get,
                `isLoading${capitalizedName}`,
                async (id) => {
                    const res = await axiosInstance.get(`${apiEndpoint}/${resourceName}/${id}`);
                    return res.data;
                },
                {
                    onSuccess: (result, set) => {
                        set({ [resourceName]: result[resourceName] || result });
                    }
                }
            ),

        // Create item
        [`create${capitalizedName}`]: (set, get) =>
            createAsyncAction(
                set,
                get,
                `isCreating${capitalizedName}`,
                async (data) => {
                    const res = await axiosInstance.post(`${apiEndpoint}/create`, data);
                    return res.data;
                },
                {
                    successMessage: `${capitalizedName} created successfully`,
                    onSuccess: (result, set, get) => {
                        const items = get()[`${resourceName}s`];
                        set({ [`${resourceName}s`]: [result[resourceName], ...items] });
                    }
                }
            ),

        // Delete item
        [`delete${capitalizedName}`]: (set, get) =>
            createAsyncAction(
                set,
                get,
                `isDeleting${capitalizedName}`,
                async (id) => {
                    await axiosInstance.delete(`${apiEndpoint}/delete/${id}`);
                    return id;
                },
                {
                    successMessage: `${capitalizedName} deleted successfully`,
                    onSuccess: (deletedId, set, get) => {
                        const items = get()[`${resourceName}s`];
                        set({ [`${resourceName}s`]: items.filter(item => item._id !== deletedId) });
                    }
                }
            )
    };
};

/**
 * Creates initial loading states for a store
 * @param {string} resourceName - Name of the resource
 * @param {Array} operations - Array of operation names (e.g., ['Loading', 'Creating', 'Deleting'])
 */
export const createLoadingStates = (resourceName, operations = ['Loading']) => {
    const capitalizedName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
    const states = {};

    operations.forEach(operation => {
        states[`is${operation}${capitalizedName}`] = false;
        if (operation === 'Loading') {
            states[`is${operation}${capitalizedName}s`] = false; // plural version
        }
    });

    return states;
};