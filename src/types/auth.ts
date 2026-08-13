export type UserRole = "root_admin" | "admin" | "support" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: UserRole;
  isGuest?: boolean;
}
