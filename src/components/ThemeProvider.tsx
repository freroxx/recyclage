import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";

// Custom ThemeProvider wrapper to ensure smooth transitions and prevent FOUC
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before applying theme to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Prevent flash of unstyled content (FOUC) by setting theme immediately
    const storedTheme = localStorage.getItem("eco-school-theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = storedTheme || systemTheme;
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      enableColorScheme={true}
      disableTransitionOnChange={false}
      storageKey="eco-school-theme"
      themes={["light", "dark"]}
      // Prevent theme flashing during initial load
      forcedTheme={props.forcedTheme || undefined}
      // Smooth theme switching
      themeTransition="all 0.3s ease"
      // Additional props passed from App.tsx
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
