import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MotionSystem from "./animations/MotionSystem";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionSystem />
    <App />
  </StrictMode>,
);