import type { DashboardSection } from "../../types/dashboard";

export type Agent = "lu" | "theo";
export type Section = DashboardSection;

export interface Destination {
  id: string;
  city: string;
  country: string;
  description: string;
  image: string;
  price: string;
  tag: string;
}

export const destinations: Destination[] = [
  {
    id: "rio",
    city: "Rio de Janeiro",
    country: "Brasil",
    description: "Praia, natureza e uma cidade que nunca fica sem assunto.",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80",
    price: "A partir de R$ 850",
    tag: "Praia",
  },
  {
    id: "gramado",
    city: "Gramado",
    country: "Brasil",
    description: "Clima aconchegante, gastronomia e paisagens serranas.",
    image:
      "https://images.unsplash.com/photo-1596395819057-e37f55a8516c?auto=format&fit=crop&w=900&q=80",
    price: "A partir de R$ 1.100",
    tag: "Romântico",
  },
  {
    id: "lisboa",
    city: "Lisboa",
    country: "Portugal",
    description:
      "História, gastronomia e ruas perfeitas para caminhar sem pressa.",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
    price: "A partir de R$ 3.900",
    tag: "Internacional",
  },
];

export const agentContent: Record<
  Agent,
  {
    name: string;
    greeting: string;
    description: string;
  }
> = {
  lu: {
    name: "Lu",
    greeting: "Bora descobrir algo novo?",
    description:
      "Estou pronta para ajudar você a planejar, explorar e encontrar seu próximo destino.",
  },
  theo: {
    name: "Theo",
    greeting: "Vamos organizar seu próximo passo?",
    description:
      "Posso ajudar você a planejar sua próxima experiência de forma prática e objetiva.",
  },
};

export const destinationFilters = [
  "Todos",
  "Praia",
  "Romântico",
  "Internacional",
];
