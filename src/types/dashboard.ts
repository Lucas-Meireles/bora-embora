export type DashboardSection =
  | "inicio"
  | "explorar"
  | "viagens"
  | "assistente"
  | "favoritos"
  | "configuracoes";

export interface DashboardNavItem {
  id: DashboardSection;
  icon: string;
  label: string;
}
