import AgentAvatar from "./AgentAvatar";

export type AgentType = "lu" | "theo";

interface AgentCardProps {
  agent: AgentType;
  name: string;
  role: string;
  description: string;
  traits: string[];
  selected: boolean;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

export default function AgentCard({
  agent,
  name,
  role,
  description,
  traits,
  selected,
  hovered,
  onHover,
  onLeave,
  onSelect,
}: AgentCardProps) {
  return (
    <article
      className={`
        agent-card
        agent-card-${agent}
        ${hovered ? "is-hovered" : ""}
        ${selected ? "is-selected" : ""}
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
    >
      {/* Brilho interno */}
      <div className="agent-card-glow" />

      {/* Área do personagem */}
      <div className="agent-avatar-stage">
        <AgentAvatar agent={agent} />

        <div className="agent-avatar-shadow" />
      </div>

      {/* Conteúdo */}
      <div className="agent-card-content">

        <div className="agent-card-heading">
          <div>
            <span className="agent-role">
              {role}
            </span>

            <h2>{name}</h2>
          </div>

          <span className="agent-arrow">
            ↗
          </span>
        </div>

        <p className="agent-description">
          {description}
        </p>

        <div className="agent-traits">
          {traits.map((trait) => (
            <span key={trait}>
              {trait}
            </span>
          ))}
        </div>

        <button
          className="agent-select-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          <span>
            Escolher {name}
          </span>

          <span className="agent-button-arrow">
            →
          </span>
        </button>

      </div>

      {/* Indicador de seleção */}
      <div className="agent-selected-indicator">
        <span />
        Escolhido
      </div>

    </article>
  );
}