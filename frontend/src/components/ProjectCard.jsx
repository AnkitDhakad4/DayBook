import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project.id}`} className="block min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
    <div className="flex items-center gap-2"><span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} /><h2 className="min-w-0 truncate font-heading text-base font-bold">{project.name}</h2></div>
    <p className="mt-3 min-h-10 line-clamp-2 break-words text-sm leading-5 text-muted">{project.description || 'A place for related tasks.'}</p>
    <p className="mt-4 text-xs font-medium text-muted">{project.doneCount || 0} of {project.taskCount || 0} tasks done</p>
    <div className="mt-2"><ProgressBar value={project.progress || 0} /></div>
  </Link>
);

export default ProjectCard;
