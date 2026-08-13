import type { ChatAgent } from "../../types/assistant";
import luImage from "../../assets/agents/lu/lu.png";
import theoImage from "../../assets/agents/theo/theo.png";

interface AgentData {
  name: string;
  role: string;
  avatar: string;
  color: string;
  welcome: string;
}

export const agentData: Record<ChatAgent, AgentData> = {
  lu: {
    name: "Lu",
    role: "Sua companheira de viagem",
    avatar: luImage,
    color: "lu",

    welcome:
      "Oi! 👋 Eu sou a Lu. Estou pronta para ajudar você a descobrir seu próximo destino. Me conta, o que você está pensando em fazer?",
  },

  theo: {
    name: "Theo",
    role: "Seu parceiro de jornada",
    avatar: theoImage,
    color: "theo",

    welcome:
      "Olá. Sou o Theo. Vamos transformar sua ideia em um plano de viagem. Me diga o que você tem em mente.",
  },
};


export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function containsAny(
  text: string,
  words: string[]
) {
  return words.some((word) =>
    text.includes(word)
  );
}


export function generateLuResponse(text: string): string {

  const message = normalizeText(text);


  if (
    containsAny(message, [
      "praia",
      "mar",
      "litoral",
      "beach",
      "areia",
      "praias",
      "agua salgada",
    ])
  ) {
    return `Praia? 🏖️ Aí você falou a minha língua!

Algumas opções que eu colocaria na nossa listinha:

🌊 Porto de Galinhas
🐠 Maragogi
🌴 Jericoacoara
☀️ Praia do Forte
🏝️ Fernando de Noronha

Mas eu não quero simplesmente jogar um destino na sua mão.

Me conta uma coisa: você quer uma viagem mais tranquila, curtir bastante ou economizar? 💛`;
  }


  if (
    containsAny(message, [
      "montanha",
      "serra",
      "trilha",
      "montanhas",
      "cabana",
      "chalé",
      "chale",
    ])
  ) {
    return `Agora sim, vamos subir um pouco! 🏔️

Se você está pensando em montanha, eu consideraria:

🏔️ Campos do Jordão
🌲 Monte Verde
🔥 Serra da Mantiqueira
🌄 Serra Gaúcha
🌿 Visconde de Mauá

Se quiser, posso separar opções para uma viagem romântica, aventura ou descanso. 😊`;
  }


  if (
    containsAny(message, [
      "frio",
      "inverno",
      "neve",
      "casaco",
      "gelado",
      "temperatura baixa",
    ])
  ) {
    return `Você quer frio? 🧣☕ Então já estou imaginando café quente, casaco e uma paisagem bonita.

Algumas ideias:

❄️ Gramado
🏔️ Campos do Jordão
🌲 Monte Verde
🍷 Bento Gonçalves
🇦🇷 Bariloche

Se quiser algo nacional, consigo focar só no Brasil.`;
  }


  if (
    containsAny(message, [
      "natureza",
      "cachoeira",
      "mata",
      "floresta",
      "ecoturismo",
      "paisagem",
      "verde",
    ])
  ) {
    return `Natureza? 🌿 Adorei.

Alguns lugares que entram facilmente na nossa lista:

💦 Chapada dos Veadeiros
🌊 Bonito
🏞️ Serra da Canastra
🌳 Ibitipoca
🏔️ Chapada Diamantina

Se você me disser quantos dias pretende viajar, consigo começar a montar um roteiro.`;
  }


  if (
    containsAny(message, [
      "aventura",
      "aventurar",
      "radical",
      "rafting",
      "rapel",
      "trilha",
      "adrenalina",
    ])
  ) {
    return `Aí gostei! 😎🔥

Se a ideia é aventura, podemos procurar:

🧗 Trilhas
🪂 Voo livre
🚣 Rafting
🧗 Rapel
🏕️ Camping
🏔️ Montanhas

Só me diga o quanto de adrenalina você aguenta que eu ajusto a rota. 😂`;
  }


  if (
    containsAny(message, [
      "romantico",
      "romantica",
      "casal",
      "namorada",
      "namorado",
      "lua de mel",
      "honeymoon",
    ])
  ) {
    return `Uma viagem a dois? 💕 Então vamos caprichar.

Eu procuraria um lugar com:

🌅 pôr do sol bonito
🍷 bons restaurantes
🏨 hospedagem aconchegante
🌙 passeios tranquilos

Gramado, Campos do Jordão, Serra Gaúcha e alguns destinos de praia podem funcionar muito bem.

Quer que eu monte opções pensando em casal?`;
  }


  if (
    containsAny(message, [
      "barato",
      "economizar",
      "economico",
      "economica",
      "pouco dinheiro",
      "gastando pouco",
      "baixo custo",
      "mais barato",
    ])
  ) {
    return `Boa! 💰 Viajar bem não precisa significar gastar uma fortuna.

Posso procurar uma viagem pensando em:

💵 hospedagem econômica
🚌 transporte mais barato
🍴 alimentação
🎟️ passeios gratuitos
📅 melhor período

Se você me disser aproximadamente quanto pretende gastar, consigo deixar as sugestões muito mais interessantes.`;
  }


  if (
    containsAny(message, [
      "fim de semana",
      "final de semana",
      "dois dias",
      "2 dias",
      "um dia",
      "bate volta",
      "bate-bolta",
    ])
  ) {
    return `Só tem um fim de semana? Então nada de passar metade da viagem no caminho. 😂

Eu priorizaria destinos mais próximos e com bastante coisa para fazer.

Me diga de onde você vai sair e eu posso pensar em algumas opções. 🚗`;
  }


  if (
    containsAny(message, [
      "exterior",
      "internacional",
      "outro pais",
      "outro país",
      "fora do brasil",
      "fora do pais",
      "argentina",
      "chile",
      "uruguai",
      "europa",
    ])
  ) {
    return `Opa, vamos colocar o passaporte para trabalhar! 🌎✈️

Algumas ideias:

🇦🇷 Argentina
🇨🇱 Chile
🇺🇾 Uruguai
🇵🇹 Portugal
🇪🇸 Espanha

Mas antes de escolher o destino, eu gostaria de saber duas coisas:

💰 quanto você pretende gastar?
📅 quantos dias terá?

Aí consigo ser bem mais certeira.`;
  }


  if (
    containsAny(message, [
      "oi",
      "ola",
      "olá",
      "eai",
      "e ai",
      "iai",
      "bom dia",
      "boa tarde",
      "boa noite",
      "hello",
    ])
  ) {
    return `Oi! 😄

Agora sim, vamos conversar!

Você pode me contar simplesmente o que está pensando.

Por exemplo:

"Quero ir para uma praia"

"Quero viajar gastando pouco"

"Quero um lugar romântico"

"Quero conhecer um lugar frio"

Não precisa falar bonito. Eu entendo a ideia. 😉`;
  }


  if (
    containsAny(message, [
      "orcamento",
      "orçamento",
      "quanto custa",
      "quanto vou gastar",
      "quanto gastar",
      "preco",
      "preço",
      "dinheiro",
      "reais",
      "r$",
    ])
  ) {
    return `Boa pergunta! 💰

Para estimar uma viagem legal, eu preciso saber:

📍 De onde você vai sair?
📅 Quantos dias?
👥 Quantas pessoas?
💵 Aproximadamente quanto pretende gastar?

Com essas informações consigo pensar em opções muito melhores.`;
  }


  return `Gostei da ideia! 👀

Ainda estou aprendendo os detalhes dessa viagem, mas podemos começar por algum destes caminhos:

🏖️ Praia
🏔️ Montanha
🌿 Natureza
❄️ Frio
💕 Viagem romântica
💰 Viagem econômica
🌎 Internacional

Me conta o que você está imaginando e eu vou montando isso com você. ✈️`;
}


export function generateTheoResponse(text: string): string {

  const message = normalizeText(text);


  if (
    containsAny(message, [
      "praia",
      "mar",
      "litoral",
      "beach",
      "areia",
      "praias",
    ])
  ) {
    return `INTENÇÃO IDENTIFICADA: PRAIA.

Vou priorizar destinos considerando três critérios:

1. Qualidade das praias
2. Custo da viagem
3. Logística de deslocamento

Sugestões iniciais:

01. Porto de Galinhas
02. Maragogi
03. Jericoacoara
04. Praia do Forte
05. Fernando de Noronha

Agora preciso de duas variáveis: orçamento e quantidade de dias.`;
  }


  if (
    containsAny(message, [
      "montanha",
      "serra",
      "trilha",
      "cabana",
      "chale",
      "chalé",
    ])
  ) {
    return `PERFIL IDENTIFICADO: MONTANHA.

Opções iniciais:

01. Campos do Jordão
02. Monte Verde
03. Serra da Mantiqueira
04. Serra Gaúcha
05. Visconde de Mauá

Para filtrar corretamente:

• duração da viagem
• orçamento
• nível de aventura

Me passe esses dados e reduzo a lista.`;
  }


  if (
    containsAny(message, [
      "frio",
      "inverno",
      "neve",
      "gelado",
      "temperatura baixa",
    ])
  ) {
    return `CRITÉRIO IDENTIFICADO: CLIMA FRIO.

Opções:

01. Gramado
02. Campos do Jordão
03. Monte Verde
04. Bariloche
05. Serra Gaúcha

Se o objetivo for neve, a estratégia muda.

Se o objetivo for apenas clima frio, existem opções nacionais mais econômicas.`;
  }


  if (
    containsAny(message, [
      "natureza",
      "cachoeira",
      "floresta",
      "ecoturismo",
      "verde",
      "paisagem",
    ])
  ) {
    return `CATEGORIA: NATUREZA.

Sugestões:

01. Bonito
02. Chapada dos Veadeiros
03. Chapada Diamantina
04. Serra da Canastra
05. Ibitipoca

Para definir a melhor opção, preciso saber se você prioriza:

A. Cachoeiras
B. Trilhas
C. Descanso
D. Ecoturismo`;
  }


  if (
    containsAny(message, [
      "barato",
      "economizar",
      "economico",
      "economica",
      "baixo custo",
      "gastando pouco",
      "pouco dinheiro",
    ])
  ) {
    return `OBJETIVO IDENTIFICADO: REDUZIR CUSTOS.

Vou considerar:

• transporte
• hospedagem
• alimentação
• passeios
• época da viagem

Me informe seu orçamento aproximado e a quantidade de dias.

Com isso conseguimos eliminar destinos incompatíveis.`;
  }


  if (
    containsAny(message, [
      "romantico",
      "romantica",
      "casal",
      "namorada",
      "namorado",
      "lua de mel",
    ])
  ) {
    return `PERFIL IDENTIFICADO: VIAGEM A DOIS.

Eu priorizaria:

01. Hospedagem
02. Gastronomia
03. Experiências
04. Privacidade
05. Custo-benefício

Destinos iniciais:

• Gramado
• Campos do Jordão
• Serra Gaúcha
• destinos de praia

Se você informar orçamento e duração, consigo estruturar uma seleção mais precisa.`;
  }


  if (
    containsAny(message, [
      "fim de semana",
      "final de semana",
      "dois dias",
      "2 dias",
      "bate volta",
      "bate-bolta",
    ])
  ) {
    return `RESTRIÇÃO IDENTIFICADA: TEMPO CURTO.

Nesse cenário, distância é um fator crítico.

Preciso saber:

📍 cidade de origem
🚗 meio de transporte
💰 orçamento

A partir disso podemos priorizar destinos viáveis para um fim de semana.`;
  }


  if (
    containsAny(message, [
      "exterior",
      "internacional",
      "outro pais",
      "outro país",
      "fora do brasil",
      "argentina",
      "chile",
      "uruguai",
      "europa",
    ])
  ) {
    return `CATEGORIA: VIAGEM INTERNACIONAL.

Antes de escolher o destino, precisamos considerar:

01. Passaporte
02. Documentação
03. Moeda
04. Passagens
05. Hospedagem
06. Orçamento

Destinos iniciais:

🇦🇷 Argentina
🇨🇱 Chile
🇺🇾 Uruguai
🇵🇹 Portugal
🇪🇸 Espanha

Informe orçamento e duração para reduzir as opções.`;
  }


  if (
    containsAny(message, [
      "oi",
      "ola",
      "olá",
      "eai",
      "e ai",
      "iai",
      "bom dia",
      "boa tarde",
      "boa noite",
    ])
  ) {
    return `Olá.

Vamos definir o objetivo da viagem primeiro.

Você pode me informar:

• destino desejado
• quantidade de dias
• orçamento
• número de pessoas

Ou simplesmente escrever algo como:

"Quero ir para a praia"

Eu identifico a categoria e começo a filtrar as opções.`;
  }


  if (
    containsAny(message, [
      "orcamento",
      "orçamento",
      "quanto custa",
      "quanto vou gastar",
      "quanto gastar",
      "preco",
      "preço",
      "dinheiro",
      "r$",
    ])
  ) {
    return `Para calcular uma estimativa precisamos de quatro variáveis:

01. Origem
02. Destino
03. Duração
04. Número de viajantes

Se você ainda não possui um destino, informe apenas seu orçamento.

Eu posso trabalhar a seleção a partir dele.`;
  }


  return `ENTENDI.

Ainda preciso de mais informações para definir a melhor rota.

Você pode informar:

• onde quer ir
• quantos dias
• orçamento
• quantidade de pessoas

Exemplo:

"Quero uma praia para passar 5 dias gastando até R$ 3.000."

A partir disso conseguimos começar a filtrar.`;
}



export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  tags: string[];
  description: string;
}

export interface TripMemory {
  origin: string;
  period: string;
  budget: string;
  people: string;
  interests: string[];
}

export const destinations: Destination[] = [
  {
    id: "porto-de-galinhas",
    name: "Porto de Galinhas",
    state: "Pernambuco",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80",
    tags: ["praia", "relaxar", "casal"],
    description: "Piscinas naturais, mar transparente e uma ótima mistura de descanso e passeio.",
  },
  {
    id: "maragogi",
    name: "Maragogi",
    state: "Alagoas",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    tags: ["praia", "natureza", "relaxar"],
    description: "Águas cristalinas e paisagens para colocar o modo férias em funcionamento.",
  },
  {
    id: "jericoacoara",
    name: "Jericoacoara",
    state: "Ceará",
    image: "https://images.unsplash.com/photo-1580206306467-5a3d1c5b5f8b?auto=format&fit=crop&w=900&q=80",
    tags: ["praia", "aventura", "casal"],
    description: "Dunas, lagoas, pôr do sol e uma pegada mais aventureira.",
  },
  {
    id: "campos-do-jordao",
    name: "Campos do Jordão",
    state: "São Paulo",
    image: "https://images.unsplash.com/photo-1605538883669-825200433431?auto=format&fit=crop&w=900&q=80",
    tags: ["frio", "casal", "montanha"],
    description: "Clima de montanha, gastronomia e passeios para dias mais tranquilos.",
  },
  {
    id: "bonito",
    name: "Bonito",
    state: "Mato Grosso do Sul",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80",
    tags: ["natureza", "aventura", "cachoeira"],
    description: "Rios cristalinos, trilhas e experiências de ecoturismo.",
  },
];

export const quickSuggestions: Record<ChatAgent, string[]> = {
  lu: [
    "Quero uma praia 🏖️",
    "Quero viajar gastando pouco 💰",
    "Quero uma viagem romântica 💕",
    "Quero um lugar frio ❄️",
  ],
  theo: [
    "Monte uma viagem de 5 dias",
    "Quero reduzir custos",
    "Quero uma viagem internacional",
    "Quero aventura",
  ],
};


