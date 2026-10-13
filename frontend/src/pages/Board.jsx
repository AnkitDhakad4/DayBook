import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskCard from '../components/TaskCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';

const columns=[{status:'todo',label:'To Do',dot:'bg-muted'},{status:'in_progress',label:'In Progress',dot:'bg-warning'},{status:'done',label:'Done',dot:'bg-success'}];

const Board = () => {
  const tasks=useTaskStore((state)=>state.tasks); const isLoading=useTaskStore((state)=>state.isLoading); const filters=useTaskStore((state)=>state.filters); const fetchTasks=useTaskStore((state)=>state.fetchTasks); const setFilters=useTaskStore((state)=>state.setFilters); const moveTask=useTaskStore((state)=>state.moveTask);
  const [dragging,setDragging]=useState(null); const [hovered,setHovered]=useState(''); const [showForm,setShowForm]=useState(false);
  useEffect(()=>{if(filters.status||filters.priority||filters.search)setFilters({status:'',priority:'',search:''});},[filters.status,filters.priority,filters.search,setFilters]);
  useEffect(()=>{fetchTasks();},[fetchTasks,filters]);
  const startDrag=(event,task)=>{event.dataTransfer.setData('text/plain',task.id);event.dataTransfer.effectAllowed='move';setDragging(task.id);};
  const drop=(event,status)=>{event.preventDefault();const id=event.dataTransfer.getData('text/plain');if(id)moveTask(id,status);setDragging(null);setHovered('');};
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-accent">A view of everything</p><h1 className="mt-2 font-heading text-2xl font-bold">Your board</h1><p className="mt-2 text-sm text-muted">Move a card as your work finds its way forward.</p></div><button onClick={()=>setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white"><Plus size={17}/>New task</button></div>
    {isLoading?<div className="grid gap-4 lg:grid-cols-3">{columns.map((column)=><div key={column.status} className="h-96 animate-pulse rounded-xl bg-surface-muted"/>)}</div>:<div className="grid items-start gap-4 lg:grid-cols-3">{columns.map((column)=>{const columnTasks=tasks.filter((task)=>task.status===column.status);return <section key={column.status} onDragOver={(event)=>{event.preventDefault();setHovered(column.status);}} onDragLeave={()=>setHovered('')} onDrop={(event)=>drop(event,column.status)} className={`min-h-80 rounded-xl border p-3 transition-colors ${hovered===column.status?'border-accent bg-accent-soft/60':'border-border bg-surface-muted/60'}`}>
      <header className="mb-3 flex items-center justify-between px-1 py-1"><h2 className="flex items-center gap-2 text-sm font-bold"><span className={`size-2 rounded-full ${column.dot}`}/>{column.label}</h2><span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted">{columnTasks.length}</span></header>
      <div className="space-y-3">{columnTasks.map((task)=><div key={task.id} className={dragging===task.id?'opacity-40':''}><TaskCard task={task} onDragStart={startDrag}/></div>)}{!columnTasks.length&&<div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">Drop a task here</div>}</div>
    </section>;})}</div>}
    {!isLoading&&!tasks.length&&<EmptyState title="A clear board" description="Create a task and give it a place to begin."/>}
    <Modal open={showForm} onClose={()=>setShowForm(false)} title="A new task"><TaskForm onDone={()=>setShowForm(false)}/></Modal>
  </div>;
};

export default Board;
