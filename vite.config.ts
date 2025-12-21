import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Dynamically import prerender to avoid require() in ESM scope
  const prerender =
    mode === "production"
      ? (await import("vite-plugin-prerender")).default
      : undefined;

  return {
    server: {
      host: "::",
      port: Number(env.VITE_PORT) || 8080,
      strictPort: true,
      open: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      mode === "development" ? componentTagger() : undefined,
      mode === "production"
        ? prerender({
            routes: [
              "/",
              "/support",
              "/resources",
              "/guide",
              "/activities",
              "/videos",
              "/posters",
              "/project",
              "/contact",
            ],
            rendererOptions: { headless: true },
          })
        : undefined,
    ].filter(Boolean),
    build: {
      target: "es2018",
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            router: ["react-router-dom"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});
