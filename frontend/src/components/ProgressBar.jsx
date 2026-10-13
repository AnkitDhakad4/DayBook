const ProgressBar = ({ value = 0, large = false }) => (
  <div className="flex items-center gap-3">
    <div
      className={`h-2 flex-1 overflow-hidden rounded-full bg-surface-muted ${large ? "h-3" : ""}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-all duration-200"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
    <span
      className={`text-xs font-semibold text-muted ${large ? "text-sm" : ""}`}
    >
      {value}%
    </span>
  </div>
);

export default ProgressBar;
