import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  // skipOnboardingNoJS = true signifie qu’on ignore l’onboarding si JS est actif
  root.render(<App skipOnboardingNoJS={true} />);
}
