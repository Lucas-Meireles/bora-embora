import type { AuthUser } from "../../types/auth";
import PageBackButton from "../../components/ui/PageBackButton";
import boraLogo from "../../assets/bora-embora-logo.png";
import "./Support.css";

interface SupportProps {
  user: AuthUser;
  onLogout: () => void;
  onHome: () => void;
}

export default function Support({ user, onLogout, onHome }: SupportProps) {
  return (
    <main className="support-page page-entrance">
      <header className="support-topbar">
        <div className="support-navigation">
          <button
            className="support-brand"
            type="button"
            onClick={onHome}
            aria-label="Ir para o início do Bora Embora"
          >
            <img
              className="support-brand-logo"
              src={boraLogo}
              alt="Bora Embora"
            />
          </button>
          <PageBackButton onClick={onHome} />
        </div>

        <div>
          <span>🎧 BORA EMBORA · SUPORTE</span>
          <h1>Central de atendimento</h1>
          <p>Uma visão clara para atender o viajante.</p>
        </div>

        <div className="support-user">
          <strong>{user.name}</strong>
          <small>Equipe de suporte</small>
          <button type="button" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <section className="support-stats">
        <article><span>Em atendimento</span><strong>--</strong></article>
        <article><span>Aguardando usuário</span><strong>--</strong></article>
        <article><span>Alta prioridade</span><strong>--</strong></article>
        <article><span>Resolvidos hoje</span><strong>--</strong></article>
      </section>

      <section className="support-layout">
        <article className="support-panel support-tickets">
          <div className="support-heading">
            <div>
              <span>Fila</span>
              <h2>Atendimentos</h2>
            </div>
          </div>

          <div className="support-empty-state">
            <strong>Nenhum atendimento carregado.</strong>
            <p>
              Os tickets serão exibidos aqui quando o backend de suporte
              estiver conectado.
            </p>
          </div>
        </article>

        <article className="support-panel support-profile">
          <span>Visão 360º</span>
          <h2>Usuário selecionado</h2>

          <div className="support-empty-state">
            <strong>Nenhum usuário selecionado.</strong>
            <p>
              Selecione um ticket para consultar viagens, histórico e
              permissões conforme o nível de acesso do atendente.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
