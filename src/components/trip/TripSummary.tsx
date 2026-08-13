import type { TripFormData } from "../../types/trip";
import TripBudget from "./TripBudget";
import TripPreferences from "./TripPreferences";
import TripRoute from "./TripRoute";

interface TripSummaryProps {
  data: TripFormData;
  onEdit: (step: number) => void;
  onSave: () => void;
}

export default function TripSummary({ data, onEdit, onSave }: TripSummaryProps) {
  const items = [
    ["Origem", data.origin || "A definir", 1],
    ["Destino", data.destination || "A definir", 2],
    ["Período", data.period || "A definir", 3],
    ["Pessoas", `${data.people || "2"} ${data.people === "1" ? "pessoa" : "pessoas"}`, 4],
    ["Orçamento", data.budget || "A definir", 5],
    ["Estilo", data.style, 6],
  ] as const;

  return (
    <div className="trip-summary">
      <div className="trip-summary-heading">
        <span>PRÉVIA DA JORNADA</span>
        <h3>Essa viagem já está tomando forma.</h3>
        <p>Revise os dados antes de salvar. Você poderá continuar o planejamento depois.</p>
      </div>

      <div className="trip-summary-highlights">
        <TripRoute origin={data.origin} destination={data.destination} />
        <TripBudget budget={data.budget} people={data.people} />
        <TripPreferences style={data.style} />
      </div>

      <div className="trip-summary-grid">
        {items.map(([label, value, step]) => (
          <button className="trip-summary-item" type="button" key={label} onClick={() => onEdit(step)}>
            <small>{label}</small>
            <strong>{value}</strong>
            <span>Editar</span>
          </button>
        ))}
      </div>

      <button className="trip-save-button" type="button" onClick={onSave}>
        <span className="trip-save-rocket" aria-hidden="true">🚀</span>
        Salvar minha viagem
      </button>
    </div>
  );
}
