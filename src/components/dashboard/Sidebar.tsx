import type { AuthUser } from "../../types/auth";
import type { DashboardNavItem, DashboardSection } from "../../types/dashboard";
import boraLogo from "../../assets/bora-embora-logo.png";

interface SidebarProps {
  section: DashboardSection;
  user: AuthUser | null;
  items: DashboardNavItem[];
  onNavigate: (section: DashboardSection) => void;
  onOpenAssistant: () => void;
  onHome: () => void;
}

export default function Sidebar({
  section,
  user,
  items,
  onNavigate,
  onOpenAssistant,
  onHome,
}: SidebarProps) {
  return (
    <aside className="dashboard-sidebar">
      <button className="dashboard-brand dashboard-brand-button" type="button" onClick={onHome} aria-label="Ir para o início do Bora Embora">
        <img className="dashboard-brand-logo" src={boraLogo} alt="Bora Embora" />
      </button>

      <nav className="dashboard-navigation" aria-label="Navegação principal">
        {items.map((item) => (
          <button
            key={item.id}
            className={`dashboard-nav-item ${section === item.id ? "active" : ""}`}
            type="button"
            onClick={() =>
              item.id === "assistente"
                ? onOpenAssistant()
                : onNavigate(item.id)
            }
          >
            <span className="dashboard-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar-bottom">
        <button
          className={`dashboard-nav-item ${section === "configuracoes" ? "active" : ""}`}
          type="button"
          onClick={() => onNavigate("configuracoes")}
        >
          <span className="dashboard-nav-icon">⚙</span>
          <span>{user?.isGuest ? "Entrar" : "Configurações"}</span>
        </button>

        <button
          className="dashboard-profile-mini"
          type="button"
          onClick={() => onNavigate("configuracoes")}
        >
          <div className="dashboard-profile-avatar">L</div>
          <div className="dashboard-profile-info">
            <strong>{user?.name || "Visitante"}</strong>
            <span>
              {user?.isGuest
                ? "Conta de convidado"
                : user
                  ? "Minha conta"
                  : "Entrar para conversar"}
            </span>
          </div>
          <span className="dashboard-profile-arrow">›</span>
        </button>
      </div>
    </aside>
  );
}
