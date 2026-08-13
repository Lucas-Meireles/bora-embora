import { api } from "./api/client";
import type { AuthUser } from "../types/auth";

interface AuthResponse {
  user: AuthUser;
}

export interface AuthProviderResult {
  configured: boolean;
  message?: string;
  redirectUrl?: string;
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.user;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const response = await api.post<AuthResponse>("/auth/register", {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  return response.user;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const response = await api.post<AuthResponse>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  return response.user;
}

export function continueAsGuest(): AuthUser {
  return {
    id: "guest",
    name: "Viajante",
    email: "",
    createdAt: new Date().toISOString(),
    role: "user",
    isGuest: true,
  };
}

export async function loginWithGoogle(): Promise<AuthProviderResult> {
  return {
    configured: false,
    message: "O acesso com Google será habilitado pelo backend.",
  };
}

export async function loginWithApple(): Promise<AuthProviderResult> {
  return {
    configured: false,
    message: "O acesso com Apple será habilitado pelo backend.",
  };
}
