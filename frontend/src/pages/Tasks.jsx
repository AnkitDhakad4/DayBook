import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore.js';
import TaskRow from '../components/TaskRow.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useProjectStore } from '../store/useProjectStore.js';

const selectClass = 'min-w-0 w-full rounded-lg border border-border bg-surface px-2.5 py-2.5 text-sm text-ink sm:px-3';

const Tasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskStore((state) => state.filters);
  const isLoading = useTaskStore((state) => state.isLoading);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const setFilters = useTaskStore((state) => state.setFilters);
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const [search, setSearch] = useState(filters.search);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFilters({ search }), 400);
    return () => clearTimeout(timer);
  }, [search, setFilters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks, filters]);
  useEffect(() => { if (!projects.length) fetchProjects(); }, [fetchProjects, projects.length]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Your list</p>
          <h1 className="mt-2 font-heading text-2xl font-bold">Tasks</h1>
          <p className="mt-2 text-sm text-muted">Keep the next step close and the rest can wait.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:opacity-90">
          <Plus size={17} />New task
        </button>
      </div>

      <div className="grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-3 lg:grid-cols-[minmax(200px,1fr)_minmax(0,2fr)]">
        <label className="relative min-w-0">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your tasks" className="w-full rounded-lg border border-border bg-page py-2.5 pl-10 pr-3 text-sm placeholder:text-muted" />
        </label>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
          <select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters({ status: event.target.value })} className={selectClass}>
            <option value="">All statuses</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option>
          </select>
          <select aria-label="Filter by priority" value={filters.priority} onChange={(event) => setFilters({ priority: event.target.value })} className={selectClass}>
            <option value="">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <select aria-label="Filter by project" value={filters.project_id || ''} onChange={(event) => setFilters({ project_id: event.target.value })} className={selectClass}>
            <option value="">All projects</option><option value="none">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
          <select aria-label="Sort tasks" value={filters.sortBy} onChange={(event) => setFilters({ sortBy: event.target.value })} className={`${selectClass} col-span-2 sm:col-span-1`}>
            <option value="created_at">Recently added</option><option value="due_date">Due date</option><option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />)}</div>
      ) : tasks.length ? (
        <div className="space-y-3">{tasks.map((task) => <TaskRow key={task.id} task={task} />)}</div>
      ) : (
        <EmptyState title="No tasks match just yet" description="Try changing your filters or add a task to get started." action={<button onClick={() => setShowForm(true)} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Create a task</button>} />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="A new task"><TaskForm onDone={() => setShowForm(false)} /></Modal>
    </div>
  );
};

export default Tasks;
