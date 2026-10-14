import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import ProjectCard from '../components/ProjectCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';

const Projects = () => {
  const projects = useProjectStore((state) => state.projects); const isLoading = useProjectStore((state) => state.isLoading); const error = useProjectStore((state) => state.error); const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  return <div className="min-w-0 space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-accent">Keep related work together</p><h1 className="mt-2 font-heading text-2xl font-bold">Projects</h1><p className="mt-2 text-sm text-muted">A little structure for the things you’re moving forward.</p></div><button onClick={() => setShowForm(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white"><Plus size={17}/>New project</button></div>
    {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="h-40 animate-pulse rounded-xl border border-border bg-surface" />)}</div> : error ? <div className="rounded-xl border border-border bg-surface p-8 text-center"><p className="text-sm text-muted">{error}</p><button onClick={fetchProjects} className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Try again</button></div> : projects.length ? <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="No projects yet" description="Start one to group your tasks." action={<button onClick={() => setShowForm(true)} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Create a project</button>} />}
    <Modal open={showForm} onClose={() => setShowForm(false)} title="A new project"><ProjectForm onDone={() => setShowForm(false)} /></Modal>
  </div>;
};

export default Projects;
