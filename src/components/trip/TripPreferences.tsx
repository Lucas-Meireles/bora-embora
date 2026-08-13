import type { TripStyle } from "../../types/trip";
interface TripPreferencesProps { style: TripStyle; }
export default function TripPreferences({ style }: TripPreferencesProps) {
  return <div className="trip-preferences-card"><span>ESTILO DA VIAGEM</span><strong>{style}</strong><small>A IA poderá usar essa preferência para personalizar sugestões.</small></div>;
}
