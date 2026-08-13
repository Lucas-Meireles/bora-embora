import { useEffect } from "react";
import { animate, stagger } from "animejs";
import boraLogo from "../../assets/bora-embora-logo.png";
import boraPlane from "../../assets/bora-plane.png";
import "./NotFound.css";

interface NotFoundProps {
  onHome: () => void;
}

export default function NotFound({ onHome }: NotFoundProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animation = animate(".not-found-reveal", {
      opacity: [0, 1],
      translateY: [reducedMotion ? 8 : 24, 0],
      duration: reducedMotion ? 1100 : 760,
      delay: stagger(reducedMotion ? 60 : 110, {
        start: 180,
      }),
      ease: "out(4)",
    });

    return () => {
      animation.pause();
    };
  }, []);

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    onHome();
  }

  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-noise" aria-hidden="true" />
      <div className="not-found-glow not-found-glow-one" aria-hidden="true" />
      <div className="not-found-glow not-found-glow-two" aria-hidden="true" />

      <header className="not-found-header not-found-reveal">
        <button
          className="not-found-brand"
          type="button"
          onClick={onHome}
          aria-label="Ir para o início do Bora Embora"
        >
          <img src={boraLogo} alt="Bora Embora" />
        </button>
      </header>

      <div className="not-found-scene" aria-hidden="true">
        <svg
          className="not-found-route"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="blur" />
            </filter>

            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2DD4C7" stopOpacity="0" />
              <stop offset="18%" stopColor="#2DD4C7" stopOpacity="0.8" />
              <stop offset="52%" stopColor="#5EEAD4" stopOpacity="1" />
              <stop offset="78%" stopColor="#FF6B5B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6B5B" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            className="not-found-route-glow"
            d="M -60 700 C 180 520, 330 790, 530 600 C 690 450, 735 360, 830 445 C 920 525, 845 630, 960 660 C 1100 695, 1115 510, 1245 405 C 1360 310, 1490 350, 1660 210"
          />

          <path
            className="not-found-route-line"
            d="M -60 700 C 180 520, 330 790, 530 600 C 690 450, 735 360, 830 445 C 920 525, 845 630, 960 660 C 1100 695, 1115 510, 1245 405 C 1360 310, 1490 350, 1660 210"
          />

          <g className="not-found-route-points">
            <circle cx="250" cy="625" r="3" />
            <circle cx="530" cy="600" r="3" />
            <circle cx="830" cy="445" r="4" />
            <circle cx="960" cy="660" r="3" />
            <circle cx="1245" cy="405" r="3" />
          </g>

          <image
            className="not-found-plane"
            href={boraPlane}
            width="118"
            height="95"
            x="-59"
            y="-47"
            preserveAspectRatio="xMidYMid meet"
          >
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              rotate="auto"
              path="M -60 700 C 180 520, 330 790, 530 600 C 690 450, 735 360, 830 445 C 920 525, 845 630, 960 660 C 1100 695, 1115 510, 1245 405 C 1360 310, 1490 350, 1660 210"
            />
          </image>
        </svg>

        <div className="not-found-flight-caption">
          <span>FLIGHT 404</span>
          <span>ROTA PERDIDA</span>
        </div>
      </div>

      <section className="not-found-content">
        <div className="not-found-copy">
          <span className="not-found-kicker not-found-reveal">
            ROTA NÃO ENCONTRADA
          </span>

          <h1
            id="not-found-title"
            className="not-found-number not-found-reveal"
          >
            <span>4</span>
            <span className="not-found-zero">0</span>
            <span>4</span>
          </h1>

          <h2 className="not-found-reveal">Essa viagem saiu da rota.</h2>

          <p className="not-found-reveal">
            O avião se perdeu pelo caminho, mas já está procurando uma nova
            rota. Vamos encontrar um caminho melhor para você.
          </p>

          <div className="not-found-actions not-found-reveal">
            <button
              className="not-found-primary"
              type="button"
              onClick={onHome}
            >
              <span aria-hidden="true">⌂</span>
              Ir para o início
            </button>

            <button
              className="not-found-secondary"
              type="button"
              onClick={goBack}
            >
              <span aria-hidden="true">←</span>
              Voltar
            </button>
          </div>
        </div>
      </section>

      <footer className="not-found-footer not-found-reveal">
        <span>BORA EMBORA</span>
        <span>·</span>
        <span>SUA AVENTURA COMEÇA AQUI</span>
      </footer>
    </main>
  );
}
