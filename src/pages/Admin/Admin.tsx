import type { AuthUser } from "../../types/auth";
import PageBackButton from "../../components/ui/PageBackButton";
import boraLogo from "../../assets/bora-embora-logo.png";
import "./Admin.css";

interface AdminProps {
  user: AuthUser;
  onLogout: () => void;
  onHome: () => void;
}

const modules = [
  "Usuários e permissões",
  "Viagens e destinos",
  "Equipe e suporte",
  "Integrações e n8n",
  "Auditoria e segurança",
];

export default function Admin({ user, onLogout, onHome }: AdminProps) {
  return (
    <main className="management-page page-entrance">
      <header className="management-topbar">
        <div className="management-navigation">
          <button
            className="management-brand"
            type="button"
            onClick={onHome}
            aria-label="Ir para o início do Bora Embora"
          >
            <img
              className="management-brand-logo"
              src={boraLogo}
              alt="Bora Embora"
            />
          </button>
          <PageBackButton onClick={onHome} />
        </div>

        <div>
          <span className="management-kicker">BORA EMBORA · ADMIN</span>
          <h1>Painel administrativo</h1>
          <p>O centro de controle da plataforma e da equipe.</p>
        </div>

        <div className="management-user">
          <strong>{user.name}</strong>
          <small>{user.role === "root_admin" ? "Root Admin" : "Admin"}</small>
          <button type="button" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <section className="management-grid">
        <article className="management-card management-card-highlight">
          <span>Usuários</span>
          <strong>--</strong>
          <small>Dados serão carregados pela API.</small>
        </article>
        <article className="management-card">
          <span>Viagens</span>
          <strong>--</strong>
          <small>Dados serão carregados pela API.</small>
        </article>
        <article className="management-card">
          <span>Atendimentos</span>
          <strong>--</strong>
          <small>Dados serão carregados pela API.</small>
        </article>
        <article className="management-card">
          <span>Integrações</span>
          <strong className="management-status">PREPARADO</strong>
          <small>n8n será acessado pelo backend.</small>
        </article>
      </section>

      <section className="management-panels">
        <article className="management-panel">
          <div className="management-panel-heading">
            <div>
              <span>Estrutura</span>
              <h2>Módulos administrativos</h2>
            </div>
          </div>

          <ul className="management-log">
            {modules.map((module) => (
              <li key={module}>
                <span>PREPARADO</span>
                <strong>{module}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="management-panel">
          <div className="management-panel-heading">
            <div>
              <span>Segurança</span>
              <h2>Auditoria</h2>
            </div>
          </div>

          <div className="management-empty-state">
            <strong>Nenhum evento carregado.</strong>
            <p>
              O histórico de ações administrativas será alimentado pelo
              endpoint de auditoria do Laravel.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
