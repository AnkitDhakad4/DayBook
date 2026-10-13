import { ClipboardList } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "A little space to start something new.",
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
    <div className="mb-4 rounded-full bg-accent-soft p-3 text-accent">
      <ClipboardList size={22} />
    </div>
    <h3 className="font-heading text-base font-bold">{title}</h3>
    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
