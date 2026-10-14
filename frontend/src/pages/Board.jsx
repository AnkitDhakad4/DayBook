import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskBoard from '../components/TaskBoard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';

const Board = () => {
  const tasks=useTaskStore((state)=>state.tasks); const isLoading=useTaskStore((state)=>state.isLoading); const filters=useTaskStore((state)=>state.filters); const fetchTasks=useTaskStore((state)=>state.fetchTasks); const setFilters=useTaskStore((state)=>state.setFilters);
  const [showForm,setShowForm]=useState(false);
  useEffect(()=>{if(filters.status||filters.priority||filters.search)setFilters({status:'',priority:'',search:''});},[filters.status,filters.priority,filters.search,setFilters]);
  useEffect(()=>{fetchTasks();},[fetchTasks,filters]);
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-accent">A view of everything</p><h1 className="mt-2 font-heading text-2xl font-bold">Your board</h1><p className="mt-2 text-sm text-muted">Move a card as your work finds its way forward.</p></div><button onClick={()=>setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white"><Plus size={17}/>New task</button></div>
    {isLoading?<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0,1,2].map((item)=><div key={item} className="h-96 animate-pulse rounded-xl bg-surface-muted"/>)}</div>:<TaskBoard tasks={tasks}/>}
    {!isLoading&&!tasks.length&&<EmptyState title="A clear board" description="Create a task and give it a place to begin."/>}
    <Modal open={showForm} onClose={()=>setShowForm(false)} title="A new task"><TaskForm onDone={()=>setShowForm(false)}/></Modal>
  </div>;
};

export default Board;
