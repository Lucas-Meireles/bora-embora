import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import AssistantChat from "../../components/chat/AssistantChat";
import AssistantWelcome from "../../components/dashboard/AssistantWelcome";
import RecentTrips from "../../components/dashboard/RecentTrips";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import TripPlanner from "../../components/trip/TripPlanner";
import {
  saveTrip as persistTrip,
  updateTrip,
} from "../../services/tripService";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoriteService";
import type { Trip as StoredTrip, TripFormData, TripStyle } from "../../types/trip";
import type { DashboardNavItem } from "../../types/dashboard";
import {
  agentContent,
  destinationFilters,
  destinations,
  type Agent,
  type Destination,
  type Section,
} from "./dashboardData";
import type { AuthUser } from "../../types/auth";
import boraLogo from "../../assets/bora-embora-logo.png";
import luImage from "../../assets/agents/lu/lu.png";
import theoImage from "../../assets/agents/theo/theo.png";

const EMPTY_FAVORITES: string[] = [];

interface DashboardProps {
  agent: "lu" | "theo";
  user: AuthUser | null;
  onRequestLogin: () => void;
  onLogout: () => void;
  onHome: () => void;
  onBack: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Bom dia,";
  }

  if (hour < 18) {
    return "Boa tarde,";
  }

  return "Boa noite,";
}

export default function Dashboard({
  agent,
  user,
  onRequestLogin,
  onLogout,
  onHome,
  onBack,
}: DashboardProps) {
  const [activeAgent, setActiveAgent] = useState<Agent>(agent);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [section, setSection] = useState<Section>("inicio");
  const [chatOpen, setChatOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [exploreSearch, setExploreSearch] = useState("");
  const [exploreFilter, setExploreFilter] = useState("Todos");
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [tripError, setTripError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [tripForm, setTripForm] = useState({
    origin: "",
    destination: "",
    period: "",
    people: "2",
    budget: "",
    style: "Descanso",
  });

  const currentAgent = agentContent[activeAgent];
  const isGuest = Boolean(user?.isGuest);
  const userId = user?.id;

  useEffect(() => {
    if (!userId || isGuest) {
      return;
    }

    let cancelled = false;

    getFavorites()
      .then((nextFavorites) => {
        if (!cancelled) {
          setFavorites(nextFavorites);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFavorites([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isGuest, userId]);

  const visibleFavorites = isGuest ? EMPTY_FAVORITES : favorites;

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bora-theme",
      theme
    );

    document.body.setAttribute(
      "data-bora-theme",
      theme
    );
  }, [theme]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setShowTripPlanner(false);
        setChatOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  function changeTheme(nextTheme: "dark" | "light") {
    setTheme(nextTheme);
  }

  function switchAssistant(nextAgent: Agent) {
    setActiveAgent(nextAgent);
  }

  function updateNotifications(value: boolean) {
    setNotifications(value);
  }

  function navigate(
    nextSection: Section
  ) {
    const protectedSections: Section[] = [
      "viagens",
      "assistente",
      "favoritos",
      "configuracoes",
    ];

    if (isGuest && protectedSections.includes(nextSection)) {
      onRequestLogin();
      return;
    }

    setSection(nextSection);

    if (
      nextSection !== "assistente"
    ) {
      setChatOpen(false);
    }
  }

  function openChat() {
    setSection("assistente");

    if (!user || user.isGuest) {
      setChatOpen(false);
      onRequestLogin();
      return;
    }

    setChatOpen(true);
  }

  function closeChat() {
    setChatOpen(false);
  }

  async function toggleFavorite(id: string) {
    if (!user || user.isGuest) {
      onRequestLogin();
      return;
    }

    setFavoriteError("");

    try {
      if (visibleFavorites.includes(id)) {
        await removeFavorite(id);
        setFavorites((current) => current.filter((item) => item !== id));
      } else {
        await addFavorite(id);
        setFavorites((current) => [...current, id]);
      }
    } catch (error) {
      setFavoriteError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seus favoritos.",
      );
    }
  }

  function openTripPlanner() {
    if (!user || user.isGuest) {
      onRequestLogin();
      return;
    }

    setEditingTripId(null);
    setShowTripPlanner(true);
  }

  function closeTripPlanner() {
    setShowTripPlanner(false);
    setEditingTripId(null);
  }

  async function saveTripFromPlanner(data: TripFormData) {
    if (!user || user.isGuest) {
      onRequestLogin();
      return;
    }

    setTripError("");

    try {
      if (editingTripId) {
        const current = trips.find((trip) => trip.id === editingTripId);

        if (current) {
          const updated = await updateTrip({
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
          });

          setTrips((items) =>
            items.map((trip) => (trip.id === updated.id ? updated : trip)),
          );
        }
      } else {
        const saved = await persistTrip(data);
        setTrips((items) => [saved, ...items]);
      }

      setShowTripPlanner(false);
      setEditingTripId(null);
      setSection("viagens");
      setTripForm({
        origin: "",
        destination: "",
        period: "",
        people: "2",
        budget: "",
        style: "Descanso",
      });
    } catch (error) {
      setTripError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a viagem. Verifique a conexão com o backend.",
      );
    }
  }

  const favoriteDestinations = destinations.filter(
    (destination) =>
      visibleFavorites.includes(destination.id)
  );

  const filteredDestinations =
    useMemo(() => {
      const search =
        exploreSearch
          .trim()
          .toLowerCase();

      return destinations.filter(
        (destination) => {
          const searchableText =
            `${destination.city} ${destination.country} ${destination.description} ${destination.tag}`
              .toLowerCase();

          const matchesSearch =
            !search ||
            searchableText.includes(
              search
            );

          const matchesFilter =
            exploreFilter ===
              "Todos" ||
            destination.tag ===
              exploreFilter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      exploreSearch,
      exploreFilter,
    ]);

  const sectionTitle: Record<
    Section,
    string
  > = {
    inicio: "Início",
    explorar: "Explorar destinos",
    viagens: "Minhas viagens",
    assistente: `Conversar com ${currentAgent.name}`,
    favoritos: "Meus favoritos",
    configuracoes:
      "Configurações",
  };

  function renderDestinationCard(
    destination: Destination
  ) {
    const isFavorite =
      visibleFavorites.includes(
        destination.id
      );

    return (
      <article
        className="dashboard-destination-card"
        key={destination.id}
      >
        <div className="dashboard-destination-image">
          <img
            src={destination.image}
            alt={destination.city}
            loading="lazy"
          />

          <span>
            {destination.tag}
          </span>

          <button
            type="button"
            className={`dashboard-favorite-button ${
              isFavorite
                ? "is-favorite"
                : ""
            }`}
            onClick={() =>
              toggleFavorite(
                destination.id
              )
            }
            aria-label={
              isFavorite
                ? `Remover ${destination.city} dos favoritos`
                : `Adicionar ${destination.city} aos favoritos`
            }
          >
            {isFavorite
              ? "♥"
              : "♡"}
          </button>
        </div>

        <div className="dashboard-destination-body">
          <div>
            <h3>
              {destination.city}
            </h3>

            <span>
              {destination.country}
            </span>
          </div>

          <p>
            {destination.description}
          </p>

          <div className="dashboard-destination-footer">
            <strong>
              {destination.price}
            </strong>

            <button
              type="button"
              onClick={() => {
                setTripForm(
                  (current) => ({
                    ...current,
                    destination:
                      destination.city,
                  })
                );

                openTripPlanner();
              }}
            >
              Planejar →
            </button>
          </div>
        </div>
      </article>
    );
  }

  function renderInicio() {
    return (
      <>
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-section-label">SEJA BEM-VINDO DE VOLTA</span>
            <h1>
              {getGreeting()}
              <span> {user?.name || "viajante"}.</span>
            </h1>
            <p>O mundo está esperando por você.</p>
          </div>

          <div className="dashboard-date">
            <span>{new Date().toLocaleDateString("pt-BR", { month: "long" }).toUpperCase()}</span>
            <strong>{new Date().getDate()}</strong>
            <span>{new Date().getFullYear()}</span>
          </div>
        </section>

        {isGuest && (
          <section className="dashboard-guest-banner" role="status">
            <div className="dashboard-guest-banner-icon">◈</div>
            <div>
              <strong>Você está navegando como convidado.</strong>
              <p>Explore destinos livremente. Para salvar viagens, favoritos ou conversar com a assistente, entre ou crie sua conta.</p>
            </div>
            <button type="button" onClick={onRequestLogin}>Entrar</button>
          </section>
        )}

        <AssistantWelcome
          agent={activeAgent}
          theme={theme}
          name={currentAgent.name}
          greeting={currentAgent.greeting}
          description={currentAgent.description}
          onOpenChat={openChat}
        />

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-label">
                ACESSO RÁPIDO
              </span>

              <h2>
                Por onde começamos?
              </h2>
            </div>
          </div>

          <div className="dashboard-quick-grid">
            <button
              className="dashboard-quick-card"
              type="button"
              onClick={() =>
                navigate("explorar")
              }
            >
              <span className="dashboard-quick-icon">
                ◇
              </span>

              <strong>
                Explorar destinos
              </strong>

              <span>
                Encontre lugares que
                combinam com você.
              </span>

              <b>→</b>
            </button>

            <button
              className="dashboard-quick-card"
              type="button"
              onClick={
                openTripPlanner
              }
            >
              <span className="dashboard-quick-icon">
                ◎
              </span>

              <strong>
                Criar uma viagem
              </strong>

              <span>
                Comece a montar sua
                próxima experiência.
              </span>

              <b>→</b>
            </button>

            <button
              className="dashboard-quick-card"
              type="button"
              onClick={openChat}
            >
              <span className="dashboard-quick-icon">
                ✦
              </span>

              <strong>
                Perguntar ao{" "}
                {currentAgent.name}
              </strong>

              <span>
                Converse com seu
                assistente.
              </span>

              <b>→</b>
            </button>
          </div>
        </section>

        <RecentTrips
          trips={trips}
          onViewAll={() => navigate("viagens")}
          onExplore={() => navigate("explorar")}
        />
      </>
    );
  }

  function renderExplorar() {
    return (
      <section className="dashboard-page-section">
        <div className="dashboard-page-header">
          <div>
            <span className="dashboard-section-label">
              INSPIRAÇÃO
            </span>

            <h1>
              {sectionTitle.explorar}
            </h1>

            <p>
              Alguns lugares para colocar
              sua próxima viagem no mapa.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-primary-action"
            onClick={
              openTripPlanner
            }
          >
            ✈ Montar minha viagem
          </button>
        </div>

        <div className="dashboard-explore-identity">
          <img src={boraLogo} alt="Bora Embora" className="dashboard-explore-logo" />
          <div>
            <span>ENCONTRE SEU PRÓXIMO DESTINO</span>
            <strong>Para onde vamos?</strong>
          </div>
        </div>

        <div className="dashboard-explore-controls">
          <label className="dashboard-search-box">
            <span>⌕</span>

            <input
              value={exploreSearch}
              onChange={(event) =>
                setExploreSearch(
                  event.target.value
                )
              }
              placeholder="Buscar destino..."
              aria-label="Buscar destino"
            />
          </label>

          <div className="dashboard-filter-list">
            {destinationFilters.map(
              (filter) => (
                <button
                  type="button"
                  key={filter}
                  className={
                    exploreFilter ===
                    filter
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setExploreFilter(
                      filter
                    )
                  }
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {filteredDestinations.length >
        0 ? (
          <div className="dashboard-destination-grid">
            {filteredDestinations.map(
              renderDestinationCard
            )}
          </div>
        ) : (
          <div className="dashboard-empty-state dashboard-page-empty">
            <div className="dashboard-empty-icon">
              ⌕
            </div>

            <h3>
              Nenhum destino encontrado.
            </h3>

            <p>
              Tente outro termo ou limpe
              os filtros.
            </p>

            <button
              type="button"
              className="dashboard-empty-button"
              onClick={() => {
                setExploreSearch("");
                setExploreFilter(
                  "Todos"
                );
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    );
  }

  function renderViagens() {
    return (
      <section className="dashboard-page-section">
        <div className="dashboard-page-header">
          <div>
            <span className="dashboard-section-label">
              PLANEJAMENTO
            </span>

            <h1>
              {sectionTitle.viagens}
            </h1>

            <p>
              Seus planos ficam disponíveis aqui e serão sincronizados com sua conta pelo backend.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-primary-action"
            onClick={
              openTripPlanner
            }
          >
            + Nova viagem
          </button>
        </div>

        {tripError && (
          <div className="dashboard-trip-error" role="alert">
            <span>{tripError}</span>
            <button type="button" onClick={() => setTripError("")}>Fechar</button>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="dashboard-empty-state dashboard-page-empty">
            <div className="dashboard-empty-icon">
              ◎
            </div>

            <h3>
              Você ainda não tem
              viagens.
            </h3>

            <p>
              Crie seu primeiro
              planejamento e vamos
              começar.
            </p>

            <button
              className="dashboard-empty-button"
              type="button"
              onClick={
                openTripPlanner
              }
            >
              Criar viagem
            </button>
          </div>
        ) : (
          <div className="dashboard-trip-list">
            {trips.map((trip) => (
              <article
                className="dashboard-trip-large-card"
                key={trip.id}
              >
                <div className="dashboard-trip-large-icon">
                  ✈
                </div>

                <div className="dashboard-trip-large-info">
                  <span>
                    {trip.status}
                  </span>

                  <h3>
                    {trip.destination}
                  </h3>

                  <p>
                    {trip.period} ·{" "}
                    {trip.people}{" "}
                    {trip.people === "1"
                      ? "pessoa"
                      : "pessoas"}{" "}
                    · {trip.budget}
                  </p>

                  <small>
                    {trip.origin} ·{" "}
                    {trip.style}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTripId(trip.id);
                    setTripForm({
                      origin:
                        trip.origin ===
                        "Origem a definir"
                          ? ""
                          : trip.origin,

                      destination:
                        trip.destination ===
                        "Destino a definir"
                          ? ""
                          : trip.destination,

                      period:
                        trip.period ===
                        "Período a definir"
                          ? ""
                          : trip.period,

                      people: String(
                        trip.people
                      ),

                      budget:
                        trip.budget ===
                        "Orçamento a definir"
                          ? ""
                          : trip.budget,

                      style:
                        trip.style ||
                        "Descanso",
                    });

                    openTripPlanner();
                  }}
                >
                  Continuar →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  function renderFavoritos() {
    return (
      <section className="dashboard-page-section">
        <div className="dashboard-page-header">
          <div>
            <span className="dashboard-section-label">
              SELECIONADOS POR VOCÊ
            </span>

            <h1>
              {sectionTitle.favoritos}
            </h1>

            <p>
              Os destinos que você
              guardou para depois.
            </p>
          </div>
        </div>

        {favoriteDestinations.length ===
        0 ? (
          <div className="dashboard-empty-state dashboard-page-empty">
            <div className="dashboard-empty-icon">
              ♡
            </div>

            <h3>
              Seus favoritos estão
              vazios.
            </h3>

            <p>
              Explore destinos e toque
              no coração para salvar
              os seus.
            </p>

            <button
              className="dashboard-empty-button"
              type="button"
              onClick={() =>
                navigate("explorar")
              }
            >
              Explorar destinos
            </button>
          </div>
        ) : (
          <div className="dashboard-destination-grid">
            {favoriteDestinations.map(
              renderDestinationCard
            )}
          </div>
        )}
      </section>
    );
  }

  function renderConfiguracoes() {
    return (
      <section className="dashboard-page-section">
        <div className="dashboard-page-header">
          <div>
            <span className="dashboard-section-label">
              PREFERÊNCIAS
            </span>

            <h1>
              {sectionTitle.configuracoes}
            </h1>

            <p>
              Controle a experiência do Bora Embora durante esta sessão.
            </p>
          </div>
        </div>

        <div className="dashboard-settings-card">
          <div className="dashboard-settings-profile">
            <div className="dashboard-profile-avatar">
              L
            </div>

            <div>
              <strong>{user?.name || "Visitante"}</strong>

              <span>
                {user ? "Minha conta" : "Entrar para conversar"}
              </span>
            </div>
          </div>

          <div className="dashboard-setting-row">
            <div>
              <strong>
                Notificações
              </strong>

              <span>
                Permitir avisos importantes
                da aplicação.
              </span>
            </div>

            <button
              type="button"
              className={`dashboard-toggle ${
                notifications
                  ? "is-on"
                  : ""
              }`}
              onClick={() => updateNotifications(!notifications)}
              aria-label="Alternar notificações"
              aria-pressed={
                notifications
              }
            >
              <span />
            </button>
          </div>

          <div className="dashboard-setting-row dashboard-theme-row">
            <div>
              <strong>
                Aparência
              </strong>

              <span>
                Escolha entre o modo
                escuro e o modo claro.
              </span>
            </div>

            <div className="dashboard-theme-switcher">
              <button
                type="button"
                className={
                  theme === "dark"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeTheme(
                    "dark"
                  )
                }
              >
                ◐ Escuro
              </button>

              <button
                type="button"
                className={
                  theme === "light"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeTheme(
                    "light"
                  )
                }
              >
                ☼ Claro
              </button>
            </div>
          </div>

          <div className="dashboard-setting-row dashboard-assistant-setting">
            <div>
              <strong>
                Assistente atual
              </strong>

              <span>
                Troque entre a Lu e o
                Theo sem perder sua
                memória de viagem.
              </span>
            </div>

            <div className="dashboard-agent-switcher">
              <button
                type="button"
                className={
                  activeAgent === "lu"
                    ? "active lu"
                    : ""
                }
                onClick={() =>
                  switchAssistant(
                    "lu"
                  )
                }
                aria-label="Selecionar Lu"
              >
                <img
                  src={luImage}
                  alt=""
                />

                <span>Lu</span>
              </button>

              <button
                type="button"
                className={
                  activeAgent === "theo"
                    ? "active theo"
                    : ""
                }
                onClick={() =>
                  switchAssistant(
                    "theo"
                  )
                }
                aria-label="Selecionar Theo"
              >
                <img
                  src={theoImage}
                  alt=""
                />

                <span>Theo</span>
              </button>
            </div>
          </div>

          <div className="dashboard-setting-row dashboard-quick-theme-row">
            <div>
              <strong>
                Troca rápida de tema
              </strong>

              <span>
                Alterne o tema rapidamente
                pelo botão no topo.
              </span>
            </div>

            <button
              type="button"
              className="dashboard-theme-topbar-button dashboard-settings-theme-button"
              onClick={() =>
                changeTheme(
                  theme === "dark"
                    ? "light"
                    : "dark"
                )
              }
              aria-label={
                theme === "dark"
                  ? "Ativar modo claro"
                  : "Ativar modo escuro"
              }
            >
              {theme === "dark"
                ? "☼"
                : "◐"}
            </button>
          </div>

          <div className="dashboard-setting-row dashboard-logout-row">
            <div>
              <strong>Conta</strong>
              <span>
                {user
                  ? `Conectado como ${user.email}`
                  : "Entre para liberar a conversa com a IA."}
              </span>
            </div>

            <button
              type="button"
              className="dashboard-logout-button"
              onClick={user ? onLogout : onRequestLogin}
            >
              {user ? "Sair da conta" : "Entrar"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderAssistente() {
    return (
      <section className="dashboard-page-section">
        <div className="dashboard-page-header">
          <div>
            <span className="dashboard-section-label">
              ASSISTENTE
            </span>

            <h1>
              {sectionTitle.assistente}
            </h1>

            <p>
              Abra a conversa quando quiser
              continuar seu planejamento.
            </p>
          </div>

          {!chatOpen && (
            <button
              type="button"
              className="dashboard-primary-action"
              onClick={openChat}
            >
              Abrir conversa →
            </button>
          )}
        </div>

        {!chatOpen && (
          <div className="dashboard-assistant-preview">
            <div className="dashboard-assistant-preview-avatar">
              <img
                src={activeAgent === "lu" ? luImage : theoImage}
                alt={`Assistente ${currentAgent.name}`}
              />
            </div>

            <div>
              <span>
                CONVERSA COM{" "}
                {currentAgent.name.toUpperCase()}
              </span>

              <h2>
                {currentAgent.greeting}
              </h2>

              <p>
                {currentAgent.description}
              </p>
            </div>
          </div>
        )}
      </section>
    );
  }

  function renderCurrentSection() {
    switch (section) {
      case "inicio":
        return renderInicio();

      case "explorar":
        return renderExplorar();

      case "viagens":
        return renderViagens();

      case "assistente":
        return renderAssistente();

      case "favoritos":
        return renderFavoritos();

      case "configuracoes":
        return renderConfiguracoes();

      default:
        return renderInicio();
    }
  }

  const navItems: DashboardNavItem[] = [
    { id: "inicio", icon: "⌂", label: "Início" },
    { id: "explorar", icon: "◇", label: "Explorar" },
    ...(!isGuest
      ? [
          { id: "viagens" as Section, icon: "◎", label: "Minhas viagens" },
          { id: "assistente" as Section, icon: "✦", label: "Assistente" },
          { id: "favoritos" as Section, icon: "♡", label: "Favoritos" },
        ]
      : []),
  ];

  return (
    <main
      className={`
        dashboard
        dashboard-${activeAgent}
        dashboard-theme-${theme}
      `}
    >
      <Sidebar
        section={section}
        user={user}
        items={navItems}
        onNavigate={navigate}
        onOpenAssistant={openChat}
        onHome={onHome}
      />

      <section className="dashboard-main">
        <Topbar
          activeAgent={activeAgent}
          theme={theme}
          agentName={currentAgent.name}
          onNavigate={navigate}
          onToggleTheme={() =>
            changeTheme(theme === "dark" ? "light" : "dark")
          }
          user={user}
          onHome={onHome}
        />

        <div className="dashboard-content">
          <button className="page-back-button dashboard-page-back" type="button" onClick={onBack}>
            <span aria-hidden="true">←</span>
            <span>Voltar</span>
          </button>
          {favoriteError && (
            <div className="dashboard-trip-error" role="alert">
              <span>{favoriteError}</span>
              <button type="button" onClick={() => setFavoriteError("")}>Fechar</button>
            </div>
          )}
          {renderCurrentSection()}
        </div>
      </section>

      {}

      <nav className="dashboard-mobile-navigation">
        {[
          { id: "inicio" as Section, icon: "⌂", label: "Início" },
          { id: "explorar" as Section, icon: "◇", label: "Explorar" },
          ...(!isGuest
            ? [
                { id: "viagens" as Section, icon: "◎", label: "Viagens" },
                { id: "assistente" as Section, icon: "✦", label: "Assistente" },
                { id: "favoritos" as Section, icon: "♡", label: "Favoritos" },
                { id: "configuracoes" as Section, icon: "⚙", label: "Config." },
              ]
            : []),
        ].map((item) => (
          <button
            key={item.id}
            className={
              section === item.id
                ? "active"
                : ""
            }
            type="button"
            onClick={() =>
              item.id ===
              "assistente"
                ? openChat()
                : navigate(
                    item.id
                  )
            }
          >
            <span>
              {item.icon}
            </span>

            <small>
              {item.label}
            </small>
          </button>
        ))}
      </nav>

      {showTripPlanner && (
        <TripPlanner
          initialData={{ ...tripForm, style: tripForm.style as TripStyle }}
          onClose={closeTripPlanner}
          onSave={saveTripFromPlanner}
        />
      )}

      {}

      {chatOpen && (
        <AssistantChat
          key={activeAgent}
          agent={activeAgent}
          theme={theme}
          onClose={closeChat}
          onSwitchAgent={() =>
            navigate("configuracoes")
          }
          onOpenTripPlanner={openTripPlanner}
        />
      )}
    </main>
  );
}