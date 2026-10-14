import { useEffect, useState } from 'react';
import { ArrowLeft, LayoutList, Pencil, Plus, Trash2, Trello } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.js';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskRow from '../components/TaskRow.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import TaskForm from '../components/TaskForm.jsx';

const ProjectDetail = () => {
  const { id } = useParams(); const navigate = useNavigate();
  const project = useProjectStore((state) => state.currentProject); const isLoading = useProjectStore((state) => state.isLoading); const fetchProject = useProjectStore((state) => state.fetchProject); const deleteProject = useProjectStore((state) => state.deleteProject);
  const tasks = useTaskStore((state) => state.tasks); const taskLoading = useTaskStore((state) => state.isLoading); const filters = useTaskStore((state) => state.filters); const setFilters = useTaskStore((state) => state.setFilters); const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const [failed, setFailed] = useState(false); const [view, setView] = useState('list'); const [editing, setEditing] = useState(false); const [showTaskForm, setShowTaskForm] = useState(false);
  useEffect(() => { setFailed(false); fetchProject(id).catch(() => setFailed(true)); setFilters({ project_id: id, status: '', priority: '', search: '' }); return () => setFilters({ project_id: '' }); }, [id, fetchProject, setFilters]);
  useEffect(() => { if (filters.project_id === id) fetchTasks(); }, [filters, fetchTasks, id]);
  const handleDelete = async () => { if (window.confirm(`Delete “${project.name}”? All tasks in this project will be deleted too.`)) { try { await deleteProject(id); setFilters({ project_id: '' }); navigate('/projects'); } catch { /* Store displays the error. */ } } };
  if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-5 w-32 rounded bg-surface-muted"/><div className="h-36 rounded-xl bg-surface-muted"/><div className="h-24 rounded-xl bg-surface-muted"/></div>;
  if (failed || !project) return <div className="rounded-xl border border-border bg-surface p-8 text-center"><h1 className="font-heading text-xl font-bold">We couldn’t find that project</h1><p className="mt-2 text-sm text-muted">It may have been removed, or there was a problem loading it.</p><Link to="/projects" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Back to projects</Link></div>;
  const refreshProject = () => fetchProject(id).catch(() => setFailed(true));
  return <div className="min-w-0 space-y-6">
    <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent"><ArrowLeft size={16}/>All projects</Link>
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ backgroundColor: project.color }}/><p className="text-sm font-medium text-accent">Project</p></div><h1 className="mt-2 break-words font-heading text-2xl font-bold sm:text-3xl">{project.name}</h1>{project.description && <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted">{project.description}</p>}</div><div className="flex flex-wrap gap-2"><button onClick={() => setEditing(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold hover:bg-surface-muted"><Pencil size={15}/>Edit</button><button onClick={handleDelete} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-danger hover:bg-danger-soft"><Trash2 size={15}/>Delete</button></div></div>
      <div className="mt-7 rounded-xl bg-page p-4 sm:p-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">Progress</span><span className="text-sm text-muted">{project.doneCount || 0} of {project.taskCount || 0} tasks complete</span></div><ProgressBar value={project.progress || 0} large/></div>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-lg font-bold">Project tasks</h2><div className="flex items-center gap-2"><div className="flex rounded-lg border border-border bg-surface p-1"><button onClick={() => setView('list')} aria-pressed={view === 'list'} className={`flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${view === 'list' ? 'bg-accent-soft text-accent' : 'text-muted'}`}><LayoutList size={15}/>List</button><button onClick={() => setView('board')} aria-pressed={view === 'board'} className={`flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${view === 'board' ? 'bg-accent-soft text-accent' : 'text-muted'}`}><Trello size={15}/>Board</button></div><button onClick={() => setShowTaskForm(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-white"><Plus size={16}/>New task</button></div></div>
    {taskLoading ? <div className="space-y-3">{[1,2,3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />)}</div> : tasks.length ? view === 'list' ? <div className="space-y-3">{tasks.map((task) => <TaskRow key={task.id} task={task}/>)}</div> : <TaskBoard tasks={tasks} onTaskMoved={refreshProject}/> : <EmptyState title="No tasks in this project yet" description="Add a task to give this project its first next step." action={<button onClick={() => setShowTaskForm(true)} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Create a task</button>} />}
    <Modal open={editing} onClose={() => setEditing(false)} title="Edit project"><ProjectForm initialData={project} onDone={() => { setEditing(false); refreshProject(); }}/></Modal>
    <Modal open={showTaskForm} onClose={() => setShowTaskForm(false)} title="A new task"><TaskForm fixedProjectId={id} onDone={() => { setShowTaskForm(false); refreshProject(); }}/></Modal>
  </div>;
};

export default ProjectDetail;
