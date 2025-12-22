import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Récupère le root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  // Passe le prop pour skip l'onboarding quand JS est actif
  root.render(<App skipOnboardingNoJS={true} />);
}
