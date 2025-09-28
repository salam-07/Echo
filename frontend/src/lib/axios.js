import axios from "axios";

// Get the base URL from environment or use localhost as fallback
const getBaseURL = () => {
    if (import.meta.env.MODE === "development") {
        // Check if VITE_API_URL is set (for network access from mobile)
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
            return `${apiUrl}/api`;
        }

        // For network access, use the current host's IP if not localhost
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `http://${window.location.hostname}:5001/api`;
        }

        // Default to localhost for development
        return "http://localhost:5001/api";
    }

    // Production
    return "/api";
};

export const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});