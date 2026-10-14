import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskCard from './TaskCard.jsx';

const columns = [{ status: 'todo', label: 'To Do', dot: 'bg-muted' }, { status: 'in_progress', label: 'In Progress', dot: 'bg-warning' }, { status: 'done', label: 'Done', dot: 'bg-success' }];

const TaskBoard = ({ tasks, onTaskMoved }) => {
  const moveTask = useTaskStore((state) => state.moveTask); const [dragging, setDragging] = useState(null); const [hovered, setHovered] = useState('');
  const startDrag = (event, task) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; setDragging(task.id); };
  const drop = async (event, status) => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) { await moveTask(id, status); onTaskMoved?.(); } setDragging(null); setHovered(''); };
  return <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">{columns.map((column) => { const columnTasks = tasks.filter((task) => task.status === column.status); return <section key={column.status} onDragOver={(event) => { event.preventDefault(); setHovered(column.status); }} onDragLeave={() => setHovered('')} onDrop={(event) => drop(event, column.status)} className={`min-h-80 rounded-xl border p-3 transition-colors ${hovered === column.status ? 'border-accent bg-accent-soft/60' : 'border-border bg-surface-muted/60'}`}>
    <header className="mb-3 flex items-center justify-between px-1 py-1"><h2 className="flex items-center gap-2 text-sm font-bold"><span className={`size-2 rounded-full ${column.dot}`} />{column.label}</h2><span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted">{columnTasks.length}</span></header>
    <div className="space-y-3">{columnTasks.map((task) => <div key={task.id} className={dragging === task.id ? 'opacity-40' : ''}><TaskCard task={task} onDragStart={startDrag} /></div>)}{!columnTasks.length && <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">Drop a task here</div>}</div>
  </section>; })}</div>;
};

export default TaskBoard;
