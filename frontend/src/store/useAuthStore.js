import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      set({ user: response.data.data.user });
      toast.success("Welcome back");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not log in");
      throw error;
    }
  },
  register: async (details) => {
    try {
      const response = await api.post("/auth/register", details);
      toast.success("Your account is ready");
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not create your account",
      );
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not log out");
    } finally {
      set({ user: null });
    }
  },
  clearAuth: () => set({ user: null, isLoading: false }),
}));
