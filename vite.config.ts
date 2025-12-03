import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: Number(env.VITE_PORT) || 8080,
      strictPort: true,
      open: true, // ouvre automatiquement le navigateur
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      mode === "development" ? componentTagger() : undefined,
    ].filter(Boolean),
    build: {
      target: "esnext",
      outDir: "dist",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: undefined, // optionnel : optimiser le split
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});
