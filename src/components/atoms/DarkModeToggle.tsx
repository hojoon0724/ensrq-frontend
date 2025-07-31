"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or system preference
    const darkPref = localStorage.getItem("theme");
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (darkPref === "dark" || (!darkPref && systemPref)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button onClick={toggleDark} className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-sm">
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
