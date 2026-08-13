interface TripProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function TripProgress({ currentStep, totalSteps, labels }: TripProgressProps) {
  return (
    <div className="trip-progress" aria-label={`Etapa ${currentStep} de ${totalSteps}`}>
      <div className="trip-progress-line">
        <span style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
      </div>
      <div className="trip-progress-steps">
        {labels.map((label, index) => {
          const step = index + 1;
          const state = step < currentStep ? "done" : step === currentStep ? "active" : "";
          return (
            <div className={`trip-progress-step ${state}`} key={label}>
              <span>{step < currentStep ? "✓" : step}</span>
              <small>{label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
