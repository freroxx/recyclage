import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

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
            staticDir: "dist",
            routes: [
              "/", "/support", "/resources", "/guide",
              "/activities", "/videos", "/posters",
              "/project", "/contact",
            ],
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
