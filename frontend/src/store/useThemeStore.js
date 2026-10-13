import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyTheme = (theme) =>
  document.documentElement.classList.toggle("dark", theme === "dark");
const startingTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: startingTheme,
      toggleTheme: () => {
        const theme = get().theme === "light" ? "dark" : "light";
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "taskly-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
