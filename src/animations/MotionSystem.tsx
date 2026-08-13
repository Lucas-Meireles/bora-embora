import { useEffect } from "react";
import { animate, stagger } from "animejs";
import ScrollReveal from "scrollreveal";

function initMotion() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const root = document.documentElement;
  const duration = reducedMotion ? 1000 : 760;

  root.dataset.motionReady = "true";

  const reveal = ScrollReveal({
    distance: reducedMotion ? "12px" : "34px",
    duration,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    opacity: 0,
    origin: "bottom",
    reset: false,
    viewFactor: 0.08,
    cleanup: true,
  }) as ReturnType<typeof ScrollReveal> & {
    sync: () => void;
  };

  reveal.reveal("[data-reveal]", { interval: reducedMotion ? 30 : 70 });
  reveal.reveal("[data-reveal-left]", {
    origin: "left",
    distance: reducedMotion ? "14px" : "42px",
    interval: reducedMotion ? 30 : 70,
  });
  reveal.reveal("[data-reveal-right]", {
    origin: "right",
    distance: reducedMotion ? "14px" : "42px",
    interval: reducedMotion ? 30 : 70,
  });
  reveal.reveal(
    ".dashboard-section, .dashboard-page-section, .dashboard-quick-card, .dashboard-destination-card, .dashboard-trip-large-card, .management-card, .management-panel, .support-panel, .support-ticket",
    { interval: reducedMotion ? 25 : 55 },
  );

  animate("[data-motion-title]", {
    opacity: [0, 1],
    y: [reducedMotion ? 10 : 22, 0],
    duration: reducedMotion ? 1100 : 900,
    ease: "outExpo",
  });

  animate("[data-motion-title-word]", {
    opacity: [0, 1],
    y: [reducedMotion ? 12 : 30, 0],
    duration: reducedMotion ? 1100 : 900,
    delay: stagger(reducedMotion ? 90 : 70),
    ease: "outExpo",
  });

  animate("[data-motion-float]", {
    y: [0, reducedMotion ? -3 : -7, 0],
    duration: reducedMotion ? 6200 : 3600,
    ease: "inOutSine",
    loop: true,
  });

  const handlePointerMove = (event: PointerEvent) => {
    if (reducedMotion) {
      return;
    }

    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;

    animate(".landing-motion-orb-one", {
      translateX: x * 0.7,
      translateY: y * 0.7,
      duration: 900,
      ease: "outQuad",
    });

    animate(".landing-motion-orb-two", {
      translateX: x * -0.45,
      translateY: y * -0.45,
      duration: 1100,
      ease: "outQuad",
    });
  };

  window.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });

  const observer = new MutationObserver(() => {
    reveal.sync();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    reveal.destroy();
    root.dataset.motionReady = "false";
  };
}

export default function MotionSystem() {
  useEffect(() => initMotion(), []);

  return null;
}
