# Bora Embora

Frontend em React + TypeScript + Vite, preparado para integração com Laravel, MySQL e n8n.

## Stack

- React
- TypeScript
- Vite
- Anime.js
- ScrollReveal
- Three.js / React Three Fiber

## Estrutura

```text
src/
├── animations/
├── assets/
├── components/
├── pages/
├── services/
│   └── api/
├── styles/
└── types/
```

## Integração com o backend

O frontend não mantém autenticação, viagens, favoritos ou memória de conversa em `localStorage` ou `sessionStorage`.

A comunicação está centralizada em `src/services/api/client.ts` e usa cookies de sessão com `credentials: include`, preparada para Laravel Sanctum.

Variáveis públicas:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_ORIGIN=http://localhost:8000
```

Segredos, credenciais de IA e webhooks n8n não devem ser colocados em variáveis `VITE_`.

## Endpoints esperados

```text
POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password

GET    /trips
POST   /trips
PUT    /trips/{id}

GET    /favorites
POST   /favorites
DELETE /favorites/{destinationId}

POST   /assistant/chat
```

O n8n deve ser chamado pelo Laravel, nunca diretamente pelo navegador.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Regras do frontend

- Não armazenar senha, token, role ou dados de negócio no navegador.
- Não expor webhook privado ou chave de API no bundle.
- O frontend apresenta permissões, mas o backend é a autoridade de segurança.
- Dados de produção devem vir da API.
- Preferências temporárias podem permanecer em memória até o endpoint correspondente existir.
- Animações devem respeitar `prefers-reduced-motion` sem remover informação ou esconder elementos importantes.
