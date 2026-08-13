import { api } from "./api/client";

interface FavoritesResponse {
  data: string[];
}

export async function getFavorites(): Promise<string[]> {
  const response = await api.get<FavoritesResponse>("/favorites");
  return response.data;
}

export async function addFavorite(destinationId: string): Promise<void> {
  await api.post("/favorites", { destinationId });
}

export async function removeFavorite(destinationId: string): Promise<void> {
  await api.delete(`/favorites/${destinationId}`);
}
