import { CalendarDays, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

const TaskCard = ({ task, onDragStart }) => <article draggable onDragStart={(event) => onDragStart(event, task)} className="group cursor-grab rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing">
  <div className="flex items-start gap-2"><GripVertical size={16} className="mt-0.5 shrink-0 text-muted/60" /><Link to={`/tasks/${task.id}`} className="min-w-0 flex-1 break-words font-semibold leading-5 hover:text-accent">{task.title}</Link></div>
  {task.description && <p className="mt-2 line-clamp-2 break-words pl-6 text-xs leading-5 text-muted">{task.description}</p>}
  {task.project_id && <p className="mt-2 flex items-center gap-1.5 truncate pl-6 text-xs text-muted"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: task.project_color || '#0d9488' }} />{task.project_name || 'Project'}</p>}
  <div className="mt-4 flex flex-wrap items-center gap-2 pl-6"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${task.priority==='high'?'bg-danger-soft text-danger':task.priority==='low'?'bg-surface-muted text-muted':'bg-warning-soft text-warning'}`}>{task.priority}</span>
    {task.due_date && <span className={`flex items-center gap-1 text-xs ${task.due_date < new Date().toISOString().slice(0,10) && task.status!=='done'?'text-danger':'text-muted'}`}><CalendarDays size={13} />{new Date(`${task.due_date}T00:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>}
  </div>
  <div className="mt-4 pl-6"><ProgressBar value={task.progress || 0} /></div>
</article>;

export default TaskCard;
