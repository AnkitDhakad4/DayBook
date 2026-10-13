const StatCard = ({ label, value = 0, hint, icon: Icon, tone = 'teal' }) => {
  const tones = { teal:'bg-accent-soft text-accent', amber:'bg-warning-soft text-warning', green:'bg-success-soft text-success', red:'bg-danger-soft text-danger' };
  return <div className="rounded-xl border border-border bg-surface p-5 shadow-sm shadow-black/[0.02]">
    <div className="flex items-start justify-between">
      <p className="text-sm font-medium text-muted">{label}</p>
      {Icon && <div className={`rounded-lg p-2 ${tones[tone]}`}><Icon size={17} /></div>}
    </div>
    <p className="mt-4 font-heading text-3xl font-bold tracking-tight">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
  </div>;
};

export default StatCard;
