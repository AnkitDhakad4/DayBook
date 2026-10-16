import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/api.js";

export const useStatsStore = create((set) => ({
  stats: null,
  isLoading: false,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/stats");
      set({ stats: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Could not load your progress",
      );
    }
  },
}));
