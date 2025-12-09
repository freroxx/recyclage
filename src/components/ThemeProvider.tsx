// components/ThemeProvider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" // Gardez dark comme thème par défaut
      enableSystem={true}
      enableColorScheme={true}
      disableTransitionOnChange={false} // IMPORTANT : permet les transitions
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
