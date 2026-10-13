import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore.js";

const ThemeToggle = ({ label = false }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  return (
    <button
      onClick={toggleTheme}
      className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted transition hover:bg-surface-muted hover:text-ink"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      {label && (
        <span>
          {theme === "light" ? "Dark appearance" : "Light appearance"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
