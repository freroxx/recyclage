import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

// Détection simple de bots Google / Aperçu des annonces ayeh ayeh
const isBot = /Googlebot|AdsBot-Google|Mediapartners-Google/i.test(navigator.userAgent);

createRoot(rootEl).render(
  <App skipOnboardingNoJS={isBot} />
);
