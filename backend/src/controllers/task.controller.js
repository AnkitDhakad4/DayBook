import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const statuses = ['todo', 'in_progress', 'done'];
const priorities = ['low', 'medium', 'high'];
const passError = (error, next) => next(error instanceof ApiError ? error : new ApiError(500, error.message));

const formatTask = (task) => ({
  ...task,
  due_date: task.due_date instanceof Date ? task.due_date.toISOString().slice(0, 10) : task.due_date
});

const includeSubtasks = async (tasks) => {
  if (!tasks.length) return [];
  const taskIds = tasks.map((task) => task.id);
  const subtasks = await sql`SELECT * FROM subtasks WHERE task_id IN ${sql(taskIds)}`;
  return tasks.map((task) => ({
    ...formatTask(task),
    subtasks: subtasks.filter((subtask) => subtask.task_id === task.id)
  }));
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'created_at', order = 'desc' } = req.query;
    if (status && !statuses.includes(status)) throw new ApiError(400, 'Invalid status');
    if (priority && !priorities.includes(priority)) throw new ApiError(400, 'Invalid priority');
    if (!['due_date', 'created_at', 'priority'].includes(sortBy)) throw new ApiError(400, 'Invalid sortBy');
    if (!['asc', 'desc'].includes(order)) throw new ApiError(400, 'Invalid order');

    let where = sql`user_id = ${req.user.id}`;
    if (status) where = sql`${where} AND status = ${status}`;
    if (priority) where = sql`${where} AND priority = ${priority}`;
    if (search) where = sql`${where} AND title ILIKE ${`%${search}%`}`;
    const tasks = await sql`
      SELECT * FROM tasks WHERE ${where}
      ORDER BY ${sql(sortBy)} ${order === 'asc' ? sql`ASC` : sql`DESC`} NULLS LAST
    `;
    const data = await includeSubtasks(tasks);
    res.status(200).json(new ApiResponse(200, data, 'Tasks fetched successfully'));
  } catch (error) { passError(error, next); }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description = null, priority = 'medium', status = 'todo', due_date = null, progress = 0 } = req.body;
    if (!title?.trim()) throw new ApiError(400, 'Title is required');
    if (!priorities.includes(priority)) throw new ApiError(400, 'Invalid priority');
    if (!statuses.includes(status)) throw new ApiError(400, 'Invalid status');
    if (!Number.isInteger(progress) || progress < 0 || progress > 100) throw new ApiError(400, 'Progress must be an integer from 0 to 100');

    const [task] = await sql`
      INSERT INTO tasks (user_id, title, description, priority, status, due_date, progress)
      VALUES (${req.user.id}, ${title.trim()}, ${description}, ${priority}, ${status}, ${due_date}, ${status === 'done' ? 100 : progress})
      RETURNING *
    `;
    const [data] = await includeSubtasks([task]);
    res.status(201).json(new ApiResponse(201, data, 'Task created successfully'));
  } catch (error) { passError(error, next); }
};

export const getTask = async (req, res, next) => {
  try {
    const [task] = await sql`SELECT * FROM tasks WHERE id = ${req.params.id} AND user_id = ${req.user.id} LIMIT 1`;
    if (!task) throw new ApiError(404, 'Task not found');
    const [data] = await includeSubtasks([task]);
    res.status(200).json(new ApiResponse(200, data, 'Task fetched successfully'));
  } catch (error) { passError(error, next); }
};

export const updateTask = async (req, res, next) => {
  try {
    const allowedFields = ['title', 'description', 'priority', 'status', 'progress', 'due_date'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (!Object.keys(updates).length) throw new ApiError(400, 'No valid fields to update');
    if (updates.title !== undefined && !updates.title?.trim()) throw new ApiError(400, 'Title cannot be empty');
    if (updates.priority !== undefined && !priorities.includes(updates.priority)) throw new ApiError(400, 'Invalid priority');
    if (updates.status !== undefined && !statuses.includes(updates.status)) throw new ApiError(400, 'Invalid status');
    if (updates.progress !== undefined && (!Number.isInteger(updates.progress) || updates.progress < 0 || updates.progress > 100)) throw new ApiError(400, 'Progress must be an integer from 0 to 100');
    if (updates.title) updates.title = updates.title.trim();
    if (updates.status === 'done') updates.progress = 100;
    updates.updated_at = new Date();
    const [task] = await sql`
      UPDATE tasks SET ${sql(updates)}
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
      RETURNING *
    `;
    if (!task) throw new ApiError(404, 'Task not found');
    const [data] = await includeSubtasks([task]);
    res.status(200).json(new ApiResponse(200, data, 'Task updated successfully'));
  } catch (error) { passError(error, next); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const [deletedTask] = await sql`
      DELETE FROM tasks WHERE id = ${req.params.id} AND user_id = ${req.user.id}
      RETURNING id
    `;
    if (!deletedTask) throw new ApiError(404, 'Task not found');
    res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
  } catch (error) { passError(error, next); }
};
