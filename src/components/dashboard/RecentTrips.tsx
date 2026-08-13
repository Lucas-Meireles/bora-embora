interface Trip {
  id: string;
  destination: string;
  status: string;
}

interface RecentTripsProps {
  trips: Trip[];
  onViewAll: () => void;
  onExplore: () => void;
}

export default function RecentTrips({
  trips,
  onViewAll,
  onExplore,
}: RecentTripsProps) {
  return (
    <section className="dashboard-section dashboard-recent">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-label">SUAS EXPERIÊNCIAS</span>
          <h2>Continue de onde parou</h2>
        </div>

        <button className="dashboard-see-all" type="button" onClick={onViewAll}>
          Ver tudo →
        </button>
      </div>

      {trips.length > 0 ? (
        <div className="dashboard-trip-grid">
          {trips.slice(0, 3).map((trip) => (
            <article className="dashboard-trip-card" key={trip.id}>
              <span>✈</span>
              <div>
                <strong>{trip.destination}</strong>
                <small>{trip.status}</small>
              </div>
              <b>→</b>
            </article>
          ))}
        </div>
      ) : (
        <div className="dashboard-empty-state">
          <div className="dashboard-empty-icon">✦</div>
          <h3>Sua próxima história ainda não começou.</h3>
          <p>Que tal descobrir um lugar novo?</p>
          <button className="dashboard-empty-button" type="button" onClick={onExplore}>
            Explorar agora
          </button>
        </div>
      )}
    </section>
  );
}
