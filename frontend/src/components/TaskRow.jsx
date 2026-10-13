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
      className="grid gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/50 hover:shadow-sm sm:grid-cols-[minmax(180px,1.5fr)_100px_130px_minmax(130px,1fr)_20px] sm:items-center"
    >
      <span className="min-w-0 truncate font-semibold">{task.title}</span>
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
      <ChevronRight size={17} className="hidden text-muted sm:block" />
    </Link>
  );
};

export default TaskRow;
