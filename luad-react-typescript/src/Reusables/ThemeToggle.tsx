import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../Configuration/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <button
        title="ThemeToggle"
        onClick={() => {
          toggleTheme();
        }}
      >
        {theme === "light" ? (
          <Icon icon="ph:moon-fill" color="#1100be" />
        ) : (
          <Icon icon="ph:sun-fill" color="#ff8" />
        )}
      </button>
    </>
  );
}
