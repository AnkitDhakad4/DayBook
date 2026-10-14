import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore.js';

const colors = ['#0d9488', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d', '#0891b2', '#475569'];
const fieldClass = 'mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink';

const ProjectForm = ({ initialData, onDone }) => {
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [form, setForm] = useState({ name: initialData?.name || '', description: initialData?.description || '', color: initialData?.color || colors[0] });
  const [error, setError] = useState(''); const [isSaving, setIsSaving] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (!form.name.trim()) return setError('Give your project a name.');
    setIsSaving(true);
    try { const payload = { ...form, name: form.name.trim(), description: form.description.trim() || null }; if (initialData?.id) await updateProject(initialData.id, payload); else await createProject(payload); onDone?.(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Please try again in a moment.'); }
    finally { setIsSaving(false); }
  };
  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-sm font-medium">Project name<input autoFocus maxLength="100" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="For example, Home refresh" className={fieldClass} /></label>
    <label className="block text-sm font-medium">Description <span className="font-normal text-muted">(optional)</span><textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What are you working toward?" className={`${fieldClass} resize-y`} /></label>
    <fieldset><legend className="text-sm font-medium">Project color</legend><div className="mt-2 flex flex-wrap gap-3">{colors.map((color) => <button key={color} type="button" aria-label={`Choose ${color}`} aria-pressed={form.color === color} onClick={() => setForm({ ...form, color })} className={`size-8 rounded-full border-2 ${form.color === color ? 'border-ink ring-2 ring-accent/30' : 'border-transparent'}`} style={{ backgroundColor: color }} />)}</div></fieldset>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    <div className="flex justify-end gap-3 border-t border-border pt-4"><button type="button" onClick={onDone} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:bg-surface-muted">Cancel</button><button disabled={isSaving} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? 'Saving…' : initialData?.id ? 'Save changes' : 'Create project'}</button></div>
  </form>;
};

export default ProjectForm;
