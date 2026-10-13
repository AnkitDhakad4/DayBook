import { useEffect, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskRow from '../components/TaskRow.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';

const selectClass='rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink';

const Tasks = () => {
  const tasks=useTaskStore((state)=>state.tasks); const filters=useTaskStore((state)=>state.filters); const isLoading=useTaskStore((state)=>state.isLoading); const fetchTasks=useTaskStore((state)=>state.fetchTasks); const setFilters=useTaskStore((state)=>state.setFilters);
  const [search,setSearch]=useState(filters.search); const [showForm,setShowForm]=useState(false);
  useEffect(()=>{const timer=setTimeout(()=>setFilters({search}),400);return()=>clearTimeout(timer);},[search,setFilters]);
  useEffect(()=>{fetchTasks();},[fetchTasks,filters]);
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-accent">Your list</p><h1 className="mt-2 font-heading text-2xl font-bold">Tasks</h1><p className="mt-2 text-sm text-muted">Keep the next step close and the rest can wait.</p></div><button onClick={()=>setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:opacity-90"><Plus size={17}/>New task</button></div>
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:flex-wrap sm:items-center"><label className="relative min-w-52 flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search your tasks" className="w-full rounded-lg border border-border bg-page py-2.5 pl-10 pr-3 text-sm placeholder:text-muted"/></label><div className="flex items-center gap-2 text-muted"><SlidersHorizontal size={16}/><select aria-label="Filter by status" value={filters.status} onChange={(e)=>setFilters({status:e.target.value})} className={selectClass}><option value="">All statuses</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select><select aria-label="Filter by priority" value={filters.priority} onChange={(e)=>setFilters({priority:e.target.value})} className={selectClass}><option value="">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><select aria-label="Sort tasks" value={filters.sortBy} onChange={(e)=>setFilters({sortBy:e.target.value})} className={selectClass}><option value="created_at">Recently added</option><option value="due_date">Due date</option><option value="priority">Priority</option></select></div></div>
    {isLoading?<div className="space-y-3">{[0,1,2].map((i)=><div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface"/>)}</div>:tasks.length?<div className="space-y-3">{tasks.map((task)=><TaskRow key={task.id} task={task}/>)}</div>:<EmptyState title="No tasks match just yet" description="Try changing your filters or add a task to get started." action={<button onClick={()=>setShowForm(true)} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Create a task</button>}/>}
    <Modal open={showForm} onClose={()=>setShowForm(false)} title="A new task"><TaskForm onDone={()=>setShowForm(false)}/></Modal>
  </div>;
};

export default Tasks;
