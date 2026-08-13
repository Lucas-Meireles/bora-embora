import type { DashboardSection } from "../../types/dashboard";
import type { AuthUser } from "../../types/auth";
import boraLogo from "../../assets/bora-embora-logo.png";

import luImage from "../../assets/agents/lu/lu.png";
import theoImage from "../../assets/agents/theo/theo.png";
interface TopbarProps {
  activeAgent: "lu" | "theo";
  theme: "dark" | "light";
  agentName: string;
  onNavigate: (section: DashboardSection) => void;
  onToggleTheme: () => void;
  user: AuthUser | null;
  onHome: () => void;
}

const agentAvatar = {
  lu: luImage,
  theo: theoImage,
};

export default function Topbar({
  activeAgent,
  theme,
  agentName,
  onNavigate,
  onToggleTheme,
  user,
  onHome,
}: TopbarProps) {
  return (
    <header className="dashboard-topbar">
      <button className="dashboard-mobile-brand dashboard-mobile-brand-button" type="button" onClick={onHome} aria-label="Ir para o início do Bora Embora">
        <img className="dashboard-mobile-brand-logo" src={boraLogo} alt="Bora Embora" />
      </button>

      <div className="dashboard-topbar-actions">
        <button
          className="dashboard-icon-button"
          type="button"
          onClick={() => onNavigate("explorar")}
          aria-label="Explorar"
          title="Explorar"
        >
          ⌕
        </button>

        <button
          className="dashboard-icon-button"
          type="button"
          onClick={() => onNavigate("favoritos")}
          aria-label="Favoritos"
          title="Favoritos"
        >
          ♡
        </button>

        <button
          className={`dashboard-assistant-topbar-switch ${activeAgent}`}
          type="button"
          onClick={() => onNavigate("configuracoes")}
          aria-label={`Trocar assistente. Atual: ${agentName}`}
          title={`Assistente atual: ${agentName}`}
        >
          <img src={agentAvatar[activeAgent]} alt="" />
        </button>

        <button
          className="dashboard-theme-topbar-button"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? "☼" : "◐"}
        </button>

        <button
          className="dashboard-topbar-profile"
          type="button"
          onClick={() => onNavigate("configuracoes")}
          aria-label="Minha conta"
        >
          {(user?.name?.trim()?.charAt(0) || "V").toUpperCase()}
        </button>
      </div>
    </header>
  );
}
