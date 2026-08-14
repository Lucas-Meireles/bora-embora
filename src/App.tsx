import { useEffect, useState } from "react";

import AgentSelection from "./components/agents/AgentSelection";
import AuthModal from "./components/auth/AuthModal";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";
import Support from "./pages/Support/Support";
import NotFound from "./pages/NotFound/NotFound";
import type { AuthUser } from "./types/auth";
import boraLogo from "./assets/bora-embora-logo.png";
import { getSession, logout as endSession } from "./services/authService";


import "./App.css";

type Screen = "landing" | "agents" | "dashboard";
type AgentId = "lu" | "theo";


function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(() =>
    window.location.pathname === "/login",
  );
  const [forceHome, setForceHome] = useState(false);
  const isNotFound =
    !["/", "/index.html", "/login", "/app", "/admin", "/suporte"].includes(path);

  useEffect(() => {
    let active = true;

    getSession().then((session) => {
      if (!active || !session) {
        return;
      }

      setUser(session);

      if (session.role === "root_admin" || session.role === "admin") {
        navigatePath("/admin");
        return;
      }

      if (session.role === "support") {
        navigatePath("/suporte");
        return;
      }

      if (window.location.pathname === "/login") {
        setShowAuth(false);
        setScreen("agents");
        navigatePath("/app");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 950);

    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function navigatePath(nextPath: string) {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }

    setPath(nextPath);
  }

  function startJourney() {
    setForceHome(false);
    setScreen("agents");
    navigatePath("/app");
  }

  function goHome() {
    navigatePath("/");
    setShowAuth(false);
    setForceHome(true);
    setScreen("landing");
  }

  function goBackToAgents() {
    setForceHome(false);
    setScreen("agents");
  }

  function openLogin() {
    setShowAuth(true);
    navigatePath("/login");
  }

  function closeAuth() {
    setShowAuth(false);

    if (path === "/login") {
      navigatePath("/");
    }
  }

  function handleAuthenticated(nextUser: AuthUser) {
    setForceHome(false);
    setUser(nextUser);
    setShowAuth(false);

    if (nextUser.role === "root_admin" || nextUser.role === "admin") {
      navigatePath("/admin");
      return;
    }

    if (nextUser.role === "support") {
      navigatePath("/suporte");
      return;
    }

    setScreen(selectedAgent ? "dashboard" : "agents");
    navigatePath("/app");
  }

  async function logout() {
    try {
      await endSession();
    } finally {
      setUser(null);
      setShowAuth(false);
      setSelectedAgent(null);
      setScreen("landing");
      navigatePath("/");
    }
  }

  function selectAgent(agent: AgentId) {
    setSelectedAgent(agent);
    setScreen("dashboard");
    navigatePath("/app");
  }

  if (showIntro) {
    return (
      <div className="app-intro" aria-label="Bora Embora" role="status">
        <div className="app-intro-ring" aria-hidden="true" />
        <img className="app-intro-logo" src={boraLogo} alt="Bora Embora" />
      </div>
    );
  }

  if (isNotFound) {
    return <NotFound onHome={goHome} />;
  }

  if ((path === "/admin" || path === "/suporte") && !user) {
    return (
      <>
        <main className="landing-page page-entrance">
          <div className="landing-motion-orb landing-motion-orb-one" aria-hidden="true" data-motion-float />
          <div className="landing-motion-orb landing-motion-orb-two" aria-hidden="true" data-motion-float />
          <div className="landing-motion-grid" aria-hidden="true" />
          <nav className="landing-navigation" data-reveal>
            <button className="landing-brand landing-brand-button" type="button" onClick={goHome} aria-label="Ir para o início do Bora Embora">
              <img className="landing-brand-logo" src={boraLogo} alt="Bora Embora" />
            </button>
          </nav>
          <section className="landing-hero">
            <span className="landing-eyebrow">ÁREA RESTRITA</span>
            <h1>Entre para continuar.</h1>
            <p>Esta área exige uma sessão autenticada e permissões adequadas.</p>
            <div className="landing-actions">
              <button className="landing-primary-button" type="button" onClick={openLogin}>Entrar <span>→</span></button>
              <button className="landing-secondary-button" type="button" onClick={goHome}>Voltar <span>←</span></button>
            </div>
          </section>
        </main>
        <AuthModal onClose={goHome} onAuthenticated={handleAuthenticated} />
      </>
    );
  }

  if (screen === "agents") {
    return (
      <>
        <AgentSelection onSelect={selectAgent} onBack={goHome} />
        {showAuth && (
          <AuthModal
            onClose={closeAuth}
            onAuthenticated={handleAuthenticated}
          />
        )}
      </>
    );
  }

  if (forceHome) {
    return (
      <>
        <main className="landing-page page-entrance">
          <div className="landing-motion-orb landing-motion-orb-one" aria-hidden="true" data-motion-float />
          <div className="landing-motion-orb landing-motion-orb-two" aria-hidden="true" data-motion-float />
          <div className="landing-motion-grid" aria-hidden="true" />
          <nav className="landing-navigation" data-reveal>
            <button className="landing-brand landing-brand-button" type="button" onClick={goHome} aria-label="Ir para o início do Bora Embora">
              <img className="landing-brand-logo" src={boraLogo} alt="Bora Embora" />
            </button>
            <div className="landing-links">
              <a href="#explorar"></a>
              <a href="#como-funciona"></a>
            </div>
            <button className="landing-login" type="button" onClick={() => setForceHome(false)}>Voltar à minha área</button>
          </nav>
          <section className="landing-hero">
            <span className="landing-eyebrow">BORA EMBORA</span>
            <h1><span className="landing-title-line">Sua próxima história</span><span className="text-shimmer landing-title-line"> começa aqui.</span></h1>
            <p>Explore destinos e volte para sua área quando quiser. Seu acesso continua preservado.</p>
            <div className="landing-actions">
              <button className="landing-primary-button" type="button" onClick={startJourney}>Começar minha viagem <span>→</span></button>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (user?.role === "root_admin" || user?.role === "admin") {
    return <Admin user={user} onLogout={logout} onHome={goHome} />;
  }

  if (user?.role === "support") {
    return <Support user={user} onLogout={logout} onHome={goHome} />;
  }

  if (screen === "dashboard" && selectedAgent) {
    return (
      <>
        <Dashboard
          agent={selectedAgent}
          user={user}
          onRequestLogin={openLogin}
          onLogout={logout}
          onHome={goHome}
          onBack={goBackToAgents}
        />

        {showAuth && (
          <AuthModal
            onClose={closeAuth}
            onAuthenticated={handleAuthenticated}
          />
        )}
      </>
    );
  }

  return (
    <>
      <main className="landing-page page-entrance">
        <div className="landing-motion-orb landing-motion-orb-one" aria-hidden="true" data-motion-float />
        <div className="landing-motion-orb landing-motion-orb-two" aria-hidden="true" data-motion-float />
        <div className="landing-motion-grid" aria-hidden="true" />

        <nav className="landing-navigation" data-reveal>
          <button className="landing-brand landing-brand-button" type="button" onClick={goHome} aria-label="Ir para o início do Bora Embora">
            <img className="landing-brand-logo" src={boraLogo} alt="Bora Embora" />
          </button>

          <div className="landing-links">
            <a href="#explorar"></a>
            <a href="#como-funciona"></a>
          </div>

          <button
            className="landing-login"
            type="button"
            onClick={openLogin}
          >
            {user ? "Minha conta" : "Entrar"}
          </button>
        </nav>

        <section className="landing-hero" data-motion-title>
          <span className="landing-eyebrow" data-reveal>
            SUA PRÓXIMA HISTÓRIA COMEÇA AQUI
          </span>

          <h1>
            <span className="landing-title-line" data-motion-title-word>Para onde</span>
            <span className="text-shimmer landing-title-line" data-motion-title-word> nós vamos?</span>
          </h1>

          <p data-reveal>
            Descubra destinos, experiências e possibilidades.
            Monte sua viagem do seu jeito, sem complicação.
          </p>

          <div className="landing-actions" data-reveal>
            <button
              className="landing-primary-button"
              type="button"
              onClick={startJourney}
            >
              Começar minha viagem
              <span>→</span>
            </button>

            <button
              className="landing-secondary-button"
              type="button"
              onClick={() => setScreen("agents")}
            >
              Quero explorar
              <span>↗</span>
            </button>
          </div>

          <div className="landing-stats" data-reveal>
            <div>
              <strong>01</strong>
              <span>DESTINO</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>POSSIBILIDADES</span>
            </div>
          </div>
        </section>
      </main>

      {showAuth && (
        <AuthModal
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </>
  );
}

export default App;
