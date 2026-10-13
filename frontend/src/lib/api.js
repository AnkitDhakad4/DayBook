import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || "";
    const isPublicAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");
    if (error.response?.status === 401 && !isPublicAuthRequest) {
      const { useAuthStore } = await import("../store/useAuthStore.js");
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== "/login")
        window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

export default api;
