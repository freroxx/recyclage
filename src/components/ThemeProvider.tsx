import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      enableColorScheme={true}
      disableTransitionOnChange={false}  // IMPORTANT : active les transitions
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
