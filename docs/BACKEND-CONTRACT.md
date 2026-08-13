# Contrato inicial do backend

## Autenticação

### POST /auth/login

```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

Resposta:

```json
{
  "user": {
    "id": "1",
    "name": "Usuário",
    "email": "usuario@email.com",
    "createdAt": "2026-08-13T18:00:00Z",
    "role": "user"
  }
}
```

### POST /auth/register

```json
{
  "name": "Usuário",
  "email": "usuario@email.com",
  "password": "senha"
}
```

O Laravel decide a role. O primeiro usuário pode receber `root_admin` dentro de uma transação protegida.

### GET /auth/me

Retorna o usuário autenticado pela sessão Sanctum ou `401`.

### POST /auth/logout

Encerra a sessão.

## Viagens

### GET /trips

```json
{
  "data": []
}
```

### POST /trips

```json
{
  "origin": "São Paulo",
  "destination": "Gramado",
  "period": "12 a 17 de dezembro",
  "people": "2",
  "budget": "R$ 3000",
  "style": "Romântico",
  "duration": "5",
  "transport": "",
  "interests": []
}
```

### PUT /trips/{id}

Recebe o mesmo formato do recurso de viagem.

## Favoritos

### GET /favorites

```json
{
  "data": ["gramado", "rio"]
}
```

### POST /favorites

```json
{
  "destinationId": "gramado"
}
```

### DELETE /favorites/{destinationId}

Remove o favorito do usuário autenticado.

## Assistente

### POST /assistant/chat

```json
{
  "assistant": "lu",
  "message": "Quero uma viagem para praia",
  "conversationId": "uuid",
  "memory": {
    "origin": "São Paulo",
    "period": "dezembro",
    "budget": "3000",
    "people": "2",
    "interests": ["praia"]
  }
}
```

Resposta:

```json
{
  "message": "...",
  "suggestions": [],
  "destinations": [],
  "memory": {},
  "actions": []
}
```

## Regras

- O React nunca decide autorização.
- O React nunca recebe senha ou segredo.
- O n8n não é chamado pelo navegador.
- Chaves de IA ficam no backend/n8n.
- Laravel deve validar todos os payloads.
- Admin, root admin e suporte devem ser protegidos por middleware e policies.
- Ações administrativas devem gerar `audit_logs`.
