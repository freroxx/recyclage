import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🤖 Détection bot (Googlebot, Bingbot, etc.)
const isBot = () => {
  if (typeof navigator === "undefined") return true;

  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("googlebot") ||
    ua.includes("bingbot") ||
    ua.includes("yandex") ||
    ua.includes("duckduckbot") ||
    ua.includes("baiduspider") ||
    ua.includes("slurp") || // Yahoo
    ua.includes("facebookexternalhit") ||
    ua.includes("twitterbot")
  );
};

const skipOnboarding = isBot();

createRoot(document.getElementById("root")!).render(
  <App skipOnboardingNoJS={skipOnboarding} />
);
