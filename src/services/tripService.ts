import { api } from "./api/client";
import type { Trip, TripFormData } from "../types/trip";

interface TripsResponse {
  data: Trip[];
}

interface TripResponse {
  data: Trip;
}

export async function getTrips(): Promise<Trip[]> {
  const response = await api.get<TripsResponse>("/trips");
  return response.data;
}

export async function saveTrip(data: TripFormData): Promise<Trip> {
  const response = await api.post<TripResponse>("/trips", data);
  return response.data;
}

export async function updateTrip(trip: Trip): Promise<Trip> {
  const response = await api.put<TripResponse>(`/trips/${trip.id}`, trip);
  return response.data;
}
