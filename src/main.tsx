import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Détecter les bots de manière conservatrice
const isBot = () => {
  // Si pas de navigator, on est côté serveur (Vite dev/server)
  if (typeof navigator === "undefined") return true;

  const ua = navigator.userAgent?.toLowerCase() || "";

  // Liste complète de bots connus
  const bots = [
    "googlebot",
    "bingbot",
    "yandex",
    "duckduckbot",
    "baiduspider",
    "slurp",
    "facebookexternalhit",
    "twitterbot",
    "adsbot-google"
  ];

  return bots.some(bot => ua.includes(bot));
};

// On force le skip onboarding si c’est un bot
const skipOnboarding = isBot();

// Rend directement l’app avec skipOnboardingNoJS
createRoot(document.getElementById("root")!).render(
  <App skipOnboardingNoJS={skipOnboarding} />
);
