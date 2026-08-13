interface TripBudgetProps { budget: string; people: string; }
export default function TripBudget({ budget, people }: TripBudgetProps) {
  return <div className="trip-budget-card"><div><span>ORÇAMENTO INFORMADO</span><strong>{budget || "A definir"}</strong></div><div><span>VIAJANTES</span><strong>{people || "2"}</strong></div></div>;
}
