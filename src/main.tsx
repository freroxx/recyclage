import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
const skipOnboardingAttr = rootEl.dataset.skipOnboarding === "true";

createRoot(rootEl).render(
  <App skipOnboardingNoJS={skipOnboardingAttr} />
);
