import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const passError = (error, next) => next(error instanceof ApiError ? error : new ApiError(500, error.message));

const getOwnedTask = async (taskId, userId) => {
  const [task] = await sql`
    SELECT id, progress, status FROM tasks
    WHERE id = ${taskId} AND user_id = ${userId}
    LIMIT 1
  `;
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

const updateProgress = async (taskId, currentStatus) => {
  const [counts] = await sql`
    SELECT count(*)::int AS total,
      count(*) FILTER (WHERE is_completed)::int AS completed
    FROM subtasks WHERE task_id = ${taskId}
  `;
  if (!counts.total) return;
  const progress = Math.round(counts.completed / counts.total * 100);
  let status = currentStatus;
  if (progress === 100) status = 'done';
  else if (progress > 0 && status === 'todo') status = 'in_progress';
  await sql`
    UPDATE tasks SET progress = ${progress}, status = ${status}, updated_at = ${new Date()}
    WHERE id = ${taskId}
  `;
};

export const createSubtask = async (req, res, next) => {
  try {
    const task = await getOwnedTask(req.params.taskId, req.user.id);
    const { title } = req.body;
    if (!title?.trim()) throw new ApiError(400, 'Title is required');
    const [subtask] = await sql`
      INSERT INTO subtasks (task_id, title)
      VALUES (${task.id}, ${title.trim()})
      RETURNING *
    `;
    await updateProgress(task.id, task.status);
    res.status(201).json(new ApiResponse(201, subtask, 'Subtask created successfully'));
  } catch (error) { passError(error, next); }
};

export const updateSubtask = async (req, res, next) => {
  try {
    const task = await getOwnedTask(req.params.taskId, req.user.id);
    const updates = {};
    if (req.body.title !== undefined) {
      if (!req.body.title?.trim()) throw new ApiError(400, 'Title cannot be empty');
      updates.title = req.body.title.trim();
    }
    if (req.body.is_completed !== undefined) {
      if (typeof req.body.is_completed !== 'boolean') throw new ApiError(400, 'is_completed must be a boolean');
      updates.is_completed = req.body.is_completed;
    }
    if (!Object.keys(updates).length) throw new ApiError(400, 'No valid fields to update');
    const [subtask] = await sql`
      UPDATE subtasks SET ${sql(updates)}
      WHERE id = ${req.params.subtaskId} AND task_id = ${task.id}
      RETURNING *
    `;
    if (!subtask) throw new ApiError(404, 'Subtask not found');
    await updateProgress(task.id, task.status);
    res.status(200).json(new ApiResponse(200, subtask, 'Subtask updated successfully'));
  } catch (error) { passError(error, next); }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    const task = await getOwnedTask(req.params.taskId, req.user.id);
    const [subtask] = await sql`
      DELETE FROM subtasks
      WHERE id = ${req.params.subtaskId} AND task_id = ${task.id}
      RETURNING id
    `;
    if (!subtask) throw new ApiError(404, 'Subtask not found');
    await updateProgress(task.id, task.status);
    res.status(200).json(new ApiResponse(200, null, 'Subtask deleted successfully'));
  } catch (error) { passError(error, next); }
};
