import { useState } from "react";

import AgentCard, {
  type AgentType,
} from "./AgentCard";

interface AgentSelectorProps {
  onSelect: (agent: AgentType) => void;
}

const agents = [
  {
    id: "lu" as AgentType,
    name: "Lu",
    role: "Sua companheira de viagem",
    description:
      "Espontânea, curiosa e sempre pronta para descobrir algo novo com você.",
    traits: [
      "Exploradora",
      "Comunicativa",
      "Acolhedora",
      "Empolgada",
    ],
  },

  {
    id: "theo" as AgentType,
    name: "Theo",
    role: "Seu parceiro de jornada",
    description:
      "Estratégico, tranquilo e sempre pensando no melhor caminho para você.",
    traits: [
      "Objetivo",
      "Organizado",
      "Aventureiro",
      "Observador",
    ],
  },
];

export default function AgentSelector({
  onSelect,
}: AgentSelectorProps) {
  const [hoveredAgent, setHoveredAgent] =
    useState<AgentType | null>(null);

  const [selectedAgent, setSelectedAgent] =
    useState<AgentType | null>(null);

  function selectAgent(agent: AgentType) {
  setSelectedAgent(agent);

  setTimeout(() => {
    onSelect(agent);
  }, 600);
}

  return (
    <div
      className={`
        agent-selector
        ${selectedAgent ? "has-selection" : ""}
        ${selectedAgent ? `selected-${selectedAgent}` : ""}
      `}
    >
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent.id}
          name={agent.name}
          role={agent.role}
          description={agent.description}
          traits={agent.traits}
          selected={selectedAgent === agent.id}
          hovered={hoveredAgent === agent.id}
          onHover={() => {
            if (!selectedAgent) {
              setHoveredAgent(agent.id);
            }
          }}
          onLeave={() => {
            if (!selectedAgent) {
              setHoveredAgent(null);
            }
          }}
          onSelect={() => selectAgent(agent.id)}
        />
      ))}
    </div>
  );
}