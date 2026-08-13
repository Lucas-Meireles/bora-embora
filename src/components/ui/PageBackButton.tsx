interface PageBackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function PageBackButton({
  onClick,
  label = "Voltar",
}: PageBackButtonProps) {
  return (
    <button
      className="page-back-button"
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}
