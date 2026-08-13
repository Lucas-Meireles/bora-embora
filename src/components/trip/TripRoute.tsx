interface TripRouteProps { origin: string; destination: string; }
export default function TripRoute({ origin, destination }: TripRouteProps) {
  return <div className="trip-route-card"><span>{origin || "Origem"}</span><i>✈</i><strong>{destination || "Destino"}</strong></div>;
}
