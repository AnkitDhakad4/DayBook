import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar.jsx";

const TaskRow = ({ task }) => {
  const overdue =
    task.due_date &&
    task.due_date < new Date().toISOString().slice(0, 10) &&
    task.status !== "done";
  const statusText = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done",
  }[task.status];
  const statusTone = {
    todo: "bg-surface-muted text-muted",
    in_progress: "bg-warning-soft text-warning",
    done: "bg-success-soft text-success",
  }[task.status];
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/50 hover:shadow-sm md:grid-cols-[minmax(0,1.5fr)_80px_110px_minmax(0,1fr)_16px] md:items-center"
    >
      <span className="min-w-0"><span className="block truncate font-semibold">{task.title}</span>{task.project_id && <span className="mt-1 flex items-center gap-1.5 truncate text-xs font-normal text-muted"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: task.project_color || '#0d9488' }} />{task.project_name || 'Project'}</span>}</span>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${task.priority === "high" ? "bg-danger-soft text-danger" : task.priority === "medium" ? "bg-warning-soft text-warning" : "bg-surface-muted text-muted"}`}
      >
        {task.priority}
      </span>
      <span
        className={`flex items-center gap-1.5 text-xs ${overdue ? "font-medium text-danger" : "text-muted"}`}
      >
        {task.due_date && (
          <>
            <CalendarDays size={14} />
            {overdue ? "Overdue · " : ""}
            {new Date(`${task.due_date}T00:00:00`).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric", year: "numeric" },
            )}
          </>
        )}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone}`}
        >
          {statusText}
        </span>
        <div className="hidden min-w-20 flex-1 md:block">
          <ProgressBar value={task.progress || 0} />
        </div>
      </div>
      <ChevronRight size={17} className="hidden text-muted md:block" />
    </Link>
  );
};

export default TaskRow;
