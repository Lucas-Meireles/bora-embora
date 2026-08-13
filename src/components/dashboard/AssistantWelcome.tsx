import TravelGlobe from "../3d/TravelGlobe";

import luImage from "../../assets/agents/lu/lu.png";
import theoImage from "../../assets/agents/theo/theo.png";
interface AssistantWelcomeProps {
  agent: "lu" | "theo";
  theme: "dark" | "light";
  name: string;
  greeting: string;
  description: string;
  onOpenChat: () => void;
}

const avatars = {
  lu: luImage,
  theo: theoImage,
};

export default function AssistantWelcome({
  agent,
  theme,
  name,
  greeting,
  description,
  onOpenChat,
}: AssistantWelcomeProps) {
  return (
    <section className="dashboard-assistant dashboard-3d-hero">
      <div className="dashboard-assistant-background" />

      <div className="dashboard-3d-scene" aria-hidden="true">
        <TravelGlobe agent={agent} theme={theme} />
      </div>

      <div className="dashboard-assistant-copy">
        <span className="dashboard-section-label">SEU ASSISTENTE</span>
        <h2>{greeting}</h2>
        <p>{description}</p>

        <button
          className="dashboard-assistant-button"
          type="button"
          onClick={onOpenChat}
        >
          Conversar com {name}
          <span>→</span>
        </button>
      </div>

      <div className={`dashboard-assistant-avatar dashboard-assistant-avatar-${agent}`}>
        <img src={avatars[agent]} alt={`Assistente ${name}`} />
      </div>
    </section>
  );
}
