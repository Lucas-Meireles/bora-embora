import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";

import "./AssistantChat.css";
import { requestAssistant } from "../../services/assistantService";
import type { ChatAgent } from "../../types/assistant";
import {
  agentData,
  destinations,
  generateLuResponse,
  generateTheoResponse,
  normalizeText,
  quickSuggestions,
  type TripMemory,
} from "./assistantFallback";

interface Message {
  id: number;
  sender: "agent" | "user";
  text: string;
}

interface AssistantChatProps {
  agent: ChatAgent;
  theme?: "dark" | "light";
  onClose: () => void;
  onSwitchAgent?: () => void;
  onOpenTripPlanner?: () => void;
}

export default function AssistantChat({
  agent,
  theme = "dark",
  onClose,
  onSwitchAgent,
  onOpenTripPlanner,
}: AssistantChatProps) {

  const data = agentData[agent];
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      sender: "agent",
      text: data.welcome,
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [tripMemory, setTripMemory] = useState<TripMemory>({
    origin: "",
    period: "",
    budget: "",
    people: "",
    interests: [],
  });
  const [showDestinations, setShowDestinations] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());

  const suggestedDestinations = useMemo(() => {
    const interests = tripMemory.interests.map(normalizeText);

    if (!interests.length) {
      return destinations.slice(0, 3);
    }

    const ranked = destinations
      .map((destination) => ({
        destination,
        score: destination.tags.filter((tag) =>
          interests.includes(normalizeText(tag))
        ).length,
      }))
      .sort((a, b) => b.score - a.score);

    return ranked.slice(0, 3).map((item) => item.destination);
  }, [tripMemory.interests]);


  function toggleFavorite(destinationId: string) {
    setFavoriteIds((current) =>
      current.includes(destinationId)
        ? current.filter((id) => id !== destinationId)
        : [...current, destinationId]
    );
  }

  function updateTripMemory(
    field: keyof TripMemory,
    value: string
  ) {
    setTripMemory((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function applyQuickSuggestion(text: string) {
    setInput(text.replace(/\s[^\wÀ-ÿ]+$/u, "").trim());
  }

  function buildTripMessage() {
    const parts = [
      tripMemory.origin && `Saída: ${tripMemory.origin}`,
      tripMemory.period && `Período: ${tripMemory.period}`,
      tripMemory.people && `Pessoas: ${tripMemory.people}`,
      tripMemory.budget && `Orçamento: ${tripMemory.budget}`,
    ].filter(Boolean);

    const message = parts.length
      ? `Quero montar minha viagem. ${parts.join(" | ")}`
      : "Quero montar minha viagem.";

    setInput(message);
    setShowPlanner(false);
  }


  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);


  async function sendMessage() {
    const text = input.trim();

    if (!text || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      const memoryContext = [
        tripMemory.origin && `origem: ${tripMemory.origin}`,
        tripMemory.period && `período: ${tripMemory.period}`,
        tripMemory.people && `pessoas: ${tripMemory.people}`,
        tripMemory.budget && `orçamento: ${tripMemory.budget}`,
      ]
        .filter(Boolean)
        .join(", ");

      const response = await requestAssistant(
        {
          assistant: agent,
          message: text,
          conversationId: conversationId,
          memory: tripMemory,
        },
        () =>
          agent === "lu"
            ? generateLuResponse(
                memoryContext
                  ? `${text} (${memoryContext})`
                  : text,
              )
            : generateTheoResponse(
                memoryContext
                  ? `${text} (${memoryContext})`
                  : text,
              ),
      );

      const agentMessage: Message = {
        id: Date.now() + 1,
        sender: "agent",
        text: response.message,
      };

      setMessages((current) => [
        ...current,
        agentMessage,
      ]);
    } catch {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "agent",
        text:
          agent === "lu"
            ? "Ops! 😅 Tive um probleminha para pensar nessa resposta. Tenta novamente."
            : "Não consegui processar essa mensagem agora. Tente novamente.",
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  }


  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {

    if (event.key === "Enter") {
      sendMessage();
    }

    if (event.key === "Escape") {
      onClose();
    }

  }


  return (

    <div
        className={`assistant-chat assistant-chat-${data.color} assistant-chat-theme-${theme}`}
        data-agent={agent}
    >

      {}

      <div className="assistant-chat-header">

        <div className="assistant-chat-agent">

          <div className="assistant-chat-avatar">

            <img
              src={data.avatar}
              alt={`Avatar da ${data.name}`}
            />

          </div>


          <div>

            <strong>
              {data.name}
            </strong>

            <span>

              <i />

              Online

            </span>

          </div>

        </div>


            <div className="assistant-chat-header-actions">

                {onSwitchAgent && (
                    <button
                    className="assistant-chat-switch"
                    type="button"
                    onClick={onSwitchAgent}
                    aria-label={`Trocar de assistente. Assistente atual: ${data.name}`}
                    title="Trocar assistente"
                    >
                    ⇄
                    </button>
                )}

                <button
                    className="assistant-chat-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar conversa"
                >
                    ×
                </button>

            </div>

      </div>


      {}

      <div className="assistant-chat-body">

        <div className="assistant-chat-intro">

          <span className="assistant-chat-label">
            CONVERSA COM {data.name.toUpperCase()}
          </span>

          <p>
            Sua conversa fica salva neste dispositivo.
          </p>

        </div>


        <div className="assistant-chat-tools">

          {messages.length === 1 && (
            <div className="assistant-chat-suggestions">
              <span className="assistant-chat-tools-title">
                Comece por aqui
              </span>

              <div className="assistant-chat-suggestion-list">
                {quickSuggestions[agent].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => applyQuickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="assistant-chat-action-row">
            <button
              type="button"
              className="assistant-chat-trip-button"
              onClick={() => (onOpenTripPlanner ? onOpenTripPlanner() : setShowPlanner(true))}
            >
              ✈️ Montar minha viagem
            </button>

            <button
              type="button"
              className="assistant-chat-destinations-button"
              onClick={() => setShowDestinations((current) => !current)}
            >
              🗺️ Destinos
            </button>
          </div>

          {showDestinations && (
            <div className="assistant-chat-destinations">
              <div className="assistant-chat-tools-title">
                Sugestões para você
              </div>

              <div className="assistant-chat-destination-grid">
                {suggestedDestinations.map((destination) => {
                  const isFavorite = favoriteIds.includes(destination.id);

                  return (
                    <article
                      className="assistant-chat-destination-card"
                      key={destination.id}
                    >
                      <div className="assistant-chat-destination-image">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          loading="lazy"
                        />

                        <button
                          type="button"
                          className={`assistant-chat-favorite ${
                            isFavorite ? "is-favorite" : ""
                          }`}
                          onClick={() =>
                            toggleFavorite(destination.id)
                          }
                          aria-label={
                            isFavorite
                              ? `Remover ${destination.name} dos favoritos`
                              : `Adicionar ${destination.name} aos favoritos`
                          }
                        >
                          {isFavorite ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="assistant-chat-destination-content">
                        <strong>{destination.name}</strong>
                        <small>{destination.state}</small>
                        <p>{destination.description}</p>

                        <button
                          type="button"
                          onClick={() => {
                            setInput(
                              `Quero conhecer ${destination.name}.`
                            );
                            setShowDestinations(false);
                          }}
                        >
                          Conversar sobre esse destino
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="assistant-chat-messages">

          {messages.map((message) => (

            <div
              key={message.id}
              className={`assistant-message assistant-message-${message.sender}`}
            >

              <div className="assistant-message-bubble">

                {message.text}

              </div>

            </div>

          ))}


          {isTyping && (

            <div className="assistant-message assistant-message-agent">

              <div className="assistant-message-bubble assistant-typing">

                <span />
                <span />
                <span />

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

          </div>

        </div>

      </div>


      {showPlanner && (
        <div
          className="assistant-chat-planner-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Montar minha viagem"
        >
          <div className="assistant-chat-planner">
            <div className="assistant-chat-planner-header">
              <div>
                <span>PLANEJADOR</span>
                <h3>Monte sua viagem</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPlanner(false)}
                aria-label="Fechar planejador"
              >
                ×
              </button>
            </div>

            <p>
              Me passe o básico. Depois a Lu ou o Theo refinam a ideia com você.
            </p>

            <label>
              📍 De onde você vai sair?
              <input
                value={tripMemory.origin}
                onChange={(event) =>
                  updateTripMemory("origin", event.target.value)
                }
                placeholder="Ex.: São Paulo"
              />
            </label>

            <label>
              📅 Quando pretende viajar?
              <input
                value={tripMemory.period}
                onChange={(event) =>
                  updateTripMemory("period", event.target.value)
                }
                placeholder="Ex.: julho, 10 a 15 de dezembro..."
              />
            </label>

            <div className="assistant-chat-planner-two-columns">
              <label>
                👥 Pessoas
                <input
                  value={tripMemory.people}
                  onChange={(event) =>
                    updateTripMemory("people", event.target.value)
                  }
                  placeholder="Ex.: 2"
                />
              </label>

              <label>
                💰 Orçamento
                <input
                  value={tripMemory.budget}
                  onChange={(event) =>
                    updateTripMemory("budget", event.target.value)
                  }
                  placeholder="Ex.: R$ 3.000"
                />
              </label>
            </div>

            <div className="assistant-chat-planner-actions">
              <button
                type="button"
                className="assistant-chat-planner-secondary"
                onClick={() => setShowPlanner(false)}
              >
                Continuar depois
              </button>

              <button
                type="button"
                className="assistant-chat-planner-primary"
                onClick={buildTripMessage}
              >
                Continuar com {data.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {}

      <div className="assistant-chat-footer">

        <div className="assistant-chat-input">

          <input
            type="text"
            placeholder={`Converse com ${data.name}...`}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            autoFocus
          />


          <button
            type="button"
            onClick={sendMessage}
            disabled={
              !input.trim() ||
              isTyping
            }
            aria-label="Enviar mensagem"
          >
            →
          </button>

        </div>


        <span className="assistant-chat-hint">
          Pressione Enter para enviar
        </span>

      </div>

    </div>

  );
}