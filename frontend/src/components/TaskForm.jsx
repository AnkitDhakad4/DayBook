import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore.js";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent";

const TaskForm = ({ initialData, onDone }) => {
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    due_date: initialData?.due_date || "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Give your task a title to get started.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date || null,
      };
      if (initialData?.id) await updateTask(initialData.id, payload);
      else await createTask(payload);
      onDone?.();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Please try again in a moment.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium">
        Task name
        <input
          autoFocus
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="What would you like to do?"
          className={fieldClass}
          maxLength="180"
        />
      </label>
      <label className="block text-sm font-medium">
        A few details <span className="font-normal text-muted">(optional)</span>
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          rows="3"
          placeholder="Add a note or some context"
          className={`${fieldClass} resize-y`}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium">
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Status
          <select
            name="status"
            value={form.status}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Due date
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={updateField}
            className={fieldClass}
          />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:bg-surface-muted"
        >
          Cancel
        </button>
        <button
          disabled={isSaving}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {isSaving
            ? "Saving…"
            : initialData?.id
              ? "Save changes"
              : "Create task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
