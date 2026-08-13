import { ApiError, api } from "./api/client";
import type { ChatAgent } from "../types/assistant";

export interface AssistantMemory {
  origin: string;
  period: string;
  budget: string;
  people: string;
  interests: string[];
}

export interface AssistantRequest {
  assistant: ChatAgent;
  message: string;
  conversationId: string;
  memory: AssistantMemory;
}

export interface AssistantResponse {
  message: string;
  suggestions?: string[];
  destinations?: unknown[];
  memory?: Partial<AssistantMemory>;
  actions?: Array<{ type: string; payload?: unknown }>;
}

export async function requestAssistant(
  request: AssistantRequest,
  fallback: () => string,
): Promise<AssistantResponse> {
  try {
    return await api.post<AssistantResponse>("/assistant/chat", request);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    return { message: fallback() };
  }
}
