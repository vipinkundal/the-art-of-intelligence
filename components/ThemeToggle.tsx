"use client";

import { Moon, Sun } from "@phosphor-icons/react";

export function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("aoi-theme", next);
  }

  return (
    <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme" title="Toggle color theme">
      <Sun className="theme-sun" size={17} aria-hidden />
      <Moon className="theme-moon" size={17} aria-hidden />
    </button>
  );
}
