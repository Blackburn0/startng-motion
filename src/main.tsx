import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./start.css"; // start.ng's live stylesheet, so the mock-up looks like the real site in light and dark
import "./motion/motion.css";
import "./mock.css";
import Home from "./Home";
import { Footer, Header } from "./Layout";
import MotionLab from "./motion/MotionLab";
import { startMotion } from "./motion/motion";

startMotion();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    {location.pathname.replace(/\/$/, "") === "/motion" ? <MotionLab /> : <Home />}
    <Footer />
  </StrictMode>,
);
