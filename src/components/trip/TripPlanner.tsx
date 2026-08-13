import { useMemo, useState } from "react";
import type { TripFormData, TripStyle } from "../../types/trip";
import TripProgress from "./TripProgress";
import TripSummary from "./TripSummary";
import "./TripPlanner.css";

interface TripPlannerProps {
  initialData?: Partial<TripFormData>;
  presetDestination?: string;
  onClose: () => void;
  onSave: (data: TripFormData) => void;
}

const labels = ["Origem", "Destino", "Quando", "Pessoas", "Orçamento", "Estilo", "Resumo"];
const styles: TripStyle[] = ["Descanso", "Praia", "Romântico", "Aventura", "Natureza", "Internacional", "Econômico"];

const prompts = [
  ["De onde você vai sair?", "Isso ajuda a calcular deslocamento e opções mais viáveis."],
  ["Para onde você quer ir?", "Se ainda não souber, você pode deixar em branco e decidir com a Lu ou o Theo."],
  ["Quando pretende viajar?", "Pode ser uma data, um mês ou apenas uma ideia como 'nas férias'."],
  ["Quem vai com você?", "Defina quantas pessoas participarão da viagem."],
  ["Qual é o orçamento?", "Não precisa ser exato. Uma faixa já ajuda bastante."],
  ["Que tipo de viagem combina com você?", "Isso será usado para personalizar as próximas sugestões."],
] as const;

export default function TripPlanner({ initialData, presetDestination, onClose, onSave }: TripPlannerProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<TripFormData>({
    origin: initialData?.origin || "",
    destination: presetDestination || initialData?.destination || "",
    period: initialData?.period || "",
    people: initialData?.people || "2",
    budget: initialData?.budget || "",
    style: initialData?.style || "Descanso",
  });

  const currentPrompt = prompts[Math.min(step - 1, prompts.length - 1)];
  const canContinue = useMemo(() => {
    if (step === 1) return data.origin.trim().length > 0;
    if (step === 2) return data.destination.trim().length > 0;
    if (step === 3) return data.period.trim().length > 0;
    if (step === 4) return Number(data.people) > 0;
    if (step === 5) return data.budget.trim().length > 0;
    return Boolean(data.style);
  }, [data, step]);

  function update(field: keyof TripFormData, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function next() {
    if (!canContinue) return;
    setStep((current) => Math.min(7, current + 1));
  }

  function back() {
    setStep((current) => Math.max(1, current - 1));
  }

  function renderField() {
    if (step === 1) {
      return <input autoFocus value={data.origin} onChange={(event) => update("origin", event.target.value)} placeholder="Ex.: São Paulo" />;
    }
    if (step === 2) {
      return <input autoFocus value={data.destination} onChange={(event) => update("destination", event.target.value)} placeholder="Ex.: Gramado" />;
    }
    if (step === 3) {
      return <input autoFocus value={data.period} onChange={(event) => update("period", event.target.value)} placeholder="Ex.: 12 a 17 de dezembro" />;
    }
    if (step === 4) {
      return <input autoFocus type="number" min="1" max="30" value={data.people} onChange={(event) => update("people", event.target.value)} />;
    }
    if (step === 5) {
      return <input autoFocus value={data.budget} onChange={(event) => update("budget", event.target.value)} placeholder="Ex.: R$ 3.000" />;
    }
    return (
      <div className="trip-style-grid">
        {styles.map((style) => (
          <button type="button" key={style} className={data.style === style ? "active" : ""} onClick={() => update("style", style)}>
            <span>{style === "Praia" ? "🏖️" : style === "Natureza" ? "🌿" : style === "Aventura" ? "🧗" : style === "Romântico" ? "❤️" : style === "Internacional" ? "🌎" : style === "Econômico" ? "💰" : "🌅"}</span>
            {style}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="trip-planner-backdrop" role="dialog" aria-modal="true" aria-label="Montar minha viagem" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="trip-planner" onMouseDown={(event) => event.stopPropagation()}>
        <div className="trip-planner-orbit" aria-hidden="true" />
        <header className="trip-planner-header">
          <div>
            <span>MINHA VIAGEM</span>
            <h2>Vamos colocar essa ideia no mapa.</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <TripProgress currentStep={step} totalSteps={7} labels={labels} />

        <div className="trip-planner-body">
          {step < 7 ? (
            <div className="trip-step-panel" key={step}>
              <span className="trip-step-number">0{step}</span>
              <h3>{currentPrompt[0]}</h3>
              <p>{currentPrompt[1]}</p>
              <div className="trip-field">{renderField()}</div>
              {!canContinue && <small className="trip-validation">Preencha este campo para continuar.</small>}
            </div>
          ) : (
            <TripSummary data={data} onEdit={setStep} onSave={() => onSave(data)} />
          )}
        </div>

        {step < 7 && (
          <footer className="trip-planner-footer">
            <button type="button" className="trip-back-button" onClick={step === 1 ? onClose : back}>
              {step === 1 ? "Cancelar" : "← Voltar"}
            </button>
            <button type="button" className="trip-next-button" disabled={!canContinue} onClick={next}>
              {step === 6 ? "Revisar viagem" : "Continuar"}
              <span>→</span>
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
