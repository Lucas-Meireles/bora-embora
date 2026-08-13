import luImage from "../../assets/agents/lu/lu.png";
import theoImage from "../../assets/agents/theo/theo.png";

type AgentType = "lu" | "theo";

interface AgentAvatarProps {
  agent: AgentType;
}

const agentImages = {
  lu: luImage,
  theo: theoImage,
};

const agentNames = {
  lu: "Lu",
  theo: "Theo",
};

export default function AgentAvatar({
  agent,
}: AgentAvatarProps) {
  return (
    <div className={`agent-avatar agent-avatar-${agent}`}>
      <img
        src={agentImages[agent]}
        alt={`Avatar ${agentNames[agent]}`}
        className="agent-avatar-image"
      />

      <div className="agent-avatar-glow" />

      <div className="agent-status">
        <span />
        disponível
      </div>
    </div>
  );
}