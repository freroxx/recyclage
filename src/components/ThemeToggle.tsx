"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9"
        aria-label="Theme toggle loading"
      >
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    // Add smooth transition class to document
    document.documentElement.classList.add('theme-transition');
    
    // Toggle theme
    setTheme(isDark ? "light" : "dark");
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative w-9 h-9 rounded-full",
        "transition-all duration-300",
        "hover:bg-accent/10",
        "active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isHovered && "scale-110"
      )}
    >
      {/* Background ring */}
      <div className={cn(
        "absolute inset-0 rounded-full",
        "transition-all duration-300",
        isHovered ? "opacity-10 scale-110" : "opacity-0 scale-100",
        isDark ? "bg-blue-500/20" : "bg-amber-500/20"
      )} />

      {/* Icons container */}
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun className={cn(
          "absolute w-4 h-4 transition-all duration-500",
          "text-amber-600 dark:text-amber-500/80",
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )} />
        
        {/* Moon icon */}
        <Moon className={cn(
          "absolute w-4 h-4 transition-all duration-500",
          "text-blue-700 dark:text-blue-400",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        )} />
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-2 rounded-full blur-md",
        "transition-opacity duration-300",
        "pointer-events-none",
        isHovered ? "opacity-20" : "opacity-0",
        isDark ? "bg-blue-500/30" : "bg-amber-500/30"
      )} />
    </Button>
  );
}

// Alternative minimalist version
export function ThemeToggleMinimal() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-8 h-8 rounded-lg bg-muted animate-pulse"
        aria-label="Loading theme"
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative w-8 h-8 rounded-lg
        bg-gradient-to-br from-background to-muted
        border border-border
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:bg-accent
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      "
    >
      <div className="relative w-4 h-4">
        <Sun className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          theme === "dark" ? "opacity-0 scale-0" : "opacity-100 scale-100",
          "text-foreground"
        )} />
        <Moon className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0",
          "text-foreground"
        )} />
      </div>
    </button>
  );
}

// Default export
export default ThemeToggle;
