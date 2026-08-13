import AgentSelector from "./AgentSelector";
import PageBackButton from "../ui/PageBackButton";
import type { AgentType } from "./AgentCard";
import boraLogo from "../../assets/bora-embora-logo.png";

interface AgentSelectionProps {
  onSelect: (agent: AgentType) => void;
  onBack: () => void;
}

export default function AgentSelection({
  onSelect,
  onBack,
}: AgentSelectionProps) {
  return (
    <main className="agent-selection page-entrance">

      <div className="agent-background-orb agent-background-orb-one" />
      <div className="agent-background-orb agent-background-orb-two" />

      <header className="agent-selection-header">
        <PageBackButton onClick={onBack} />

        <button
          className="agent-brand"
          type="button"
          onClick={onBack}
        >
          <img className="agent-brand-logo" src={boraLogo} alt="Bora Embora" />
        </button>

        <span className="agent-step">
          02 / 03
        </span>

      </header>

      <section className="agent-selection-content" data-reveal>

        <div className="agent-introduction">

          <span className="agent-eyebrow">
            SUA JORNADA COMEÇA AQUI
          </span>

          <h1 data-motion-title>
            <span className="landing-title-line" data-motion-title-word>Quem vai</span>
            <span className="text-shimmer landing-title-line" data-motion-title-word> com você?</span>
          </h1>

          <p>
            Escolha quem vai acompanhar suas descobertas,
            decisões e próximos destinos.
          </p>

        </div>

        <AgentSelector onSelect={onSelect} />

        <footer className="agent-selection-footer">

          <span>
            Você poderá mudar seu assistente depois.
          </span>

          <div className="agent-progress">
            <span className="active" />
            <span className="active" />
            <span />
          </div>

        </footer>

      </section>

    </main>
  );
}