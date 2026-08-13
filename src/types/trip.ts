export type TripStyle =
  | "Descanso"
  | "Praia"
  | "Romântico"
  | "Aventura"
  | "Natureza"
  | "Internacional"
  | "Econômico";

export type TripStatus =
  | "Rascunho"
  | "Em planejamento"
  | "Pronta"
  | "Em viagem"
  | "Concluída";

export interface TripFormData {
  origin: string;
  destination: string;
  period: string;
  people: string;
  budget: string;
  style: TripStyle;
}

export interface Trip extends TripFormData {
  id: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TripSummaryData {
  trip: TripFormData;
}
