import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import getUserProject from '../utils/getUserProject.js';

const passError = (error, next) => next(error instanceof ApiError ? error : new ApiError(500, error.message));
const projectCounts = sql`count(tasks.id)::int AS "taskCount", count(tasks.id) FILTER (WHERE tasks.status = 'done')::int AS "doneCount"`;
const formatProject = (project) => ({
  ...project,
  progress: project.taskCount ? Math.round(project.doneCount / project.taskCount * 100) : 0
});
const withTasks = async (tasks) => {
  if (!tasks.length) return [];
  const ids = tasks.map((task) => task.id);
  const subtasks = await sql`SELECT * FROM subtasks WHERE task_id IN ${sql(ids)}`;
  return tasks.map((task) => ({ ...task, due_date: task.due_date instanceof Date ? task.due_date.toISOString().slice(0, 10) : task.due_date, subtasks: subtasks.filter((item) => item.task_id === task.id) }));
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await sql`
      SELECT projects.*, ${projectCounts}
      FROM projects LEFT JOIN tasks ON tasks.project_id = projects.id
      WHERE projects.owner_id = ${req.user.id}
      GROUP BY projects.id ORDER BY projects.created_at DESC
    `;
    res.status(200).json(new ApiResponse(200, projects.map(formatProject), 'Projects fetched successfully'));
  } catch (error) { passError(error, next); }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description = null, color = '#0d9488' } = req.body;
    if (typeof name !== 'string' || !name.trim()) throw new ApiError(400, 'Project name is required');
    if (name.trim().length > 100) throw new ApiError(400, 'Project name must be 100 characters or fewer');
    if (description !== null && typeof description !== 'string') throw new ApiError(400, 'Description must be text');
    if (typeof color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(color)) throw new ApiError(400, 'Choose a valid project color');
    const [project] = await sql`INSERT INTO projects (owner_id, name, description, color) VALUES (${req.user.id}, ${name.trim()}, ${description?.trim() || null}, ${color}) RETURNING *`;
    res.status(201).json(new ApiResponse(201, formatProject({ ...project, taskCount: 0, doneCount: 0 }), 'Project created successfully'));
  } catch (error) { passError(error, next); }
};

export const getProject = async (req, res, next) => {
  try {
    const owned = await getUserProject(req.params.id, req.user.id);
    const [project] = await sql`SELECT projects.*, ${projectCounts} FROM projects LEFT JOIN tasks ON tasks.project_id = projects.id WHERE projects.id = ${owned.id} GROUP BY projects.id`;
    const tasks = await sql`SELECT tasks.* FROM tasks WHERE project_id = ${owned.id} ORDER BY created_at DESC`;
    res.status(200).json(new ApiResponse(200, { ...formatProject(project), tasks: await withTasks(tasks) }, 'Project fetched successfully'));
  } catch (error) { passError(error, next); }
};

export const updateProject = async (req, res, next) => {
  try {
    await getUserProject(req.params.id, req.user.id);
    const updates = {};
    for (const field of ['name', 'description', 'color']) if (req.body[field] !== undefined) updates[field] = req.body[field];
    if (!Object.keys(updates).length) throw new ApiError(400, 'No valid fields to update');
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || !updates.name.trim()) throw new ApiError(400, 'Project name is required');
      if (updates.name.trim().length > 100) throw new ApiError(400, 'Project name must be 100 characters or fewer');
      updates.name = updates.name.trim();
    }
    if (updates.description !== undefined && updates.description !== null && typeof updates.description !== 'string') throw new ApiError(400, 'Description must be text');
    if (updates.description !== undefined) updates.description = updates.description?.trim() || null;
    if (updates.color !== undefined && (typeof updates.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(updates.color))) throw new ApiError(400, 'Choose a valid project color');
    updates.updated_at = new Date();
    const [project] = await sql`UPDATE projects SET ${sql(updates)} WHERE id = ${req.params.id} AND owner_id = ${req.user.id} RETURNING *`;
    const [withCounts] = await sql`SELECT projects.*, ${projectCounts} FROM projects LEFT JOIN tasks ON tasks.project_id = projects.id WHERE projects.id = ${project.id} GROUP BY projects.id`;
    res.status(200).json(new ApiResponse(200, formatProject(withCounts), 'Project updated successfully'));
  } catch (error) { passError(error, next); }
};

export const deleteProject = async (req, res, next) => {
  try {
    await getUserProject(req.params.id, req.user.id);
    const [project] = await sql`DELETE FROM projects WHERE id = ${req.params.id} AND owner_id = ${req.user.id} RETURNING id`;
    if (!project) throw new ApiError(404, 'Project not found');
    res.status(200).json(new ApiResponse(200, null, 'Project deleted successfully'));
  } catch (error) { passError(error, next); }
};
