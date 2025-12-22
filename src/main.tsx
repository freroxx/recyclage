import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  // Pass `skipOnboardingNoJS` for Googlebot / JS-off
  root.render(<App skipOnboardingNoJS={true} />);
}
