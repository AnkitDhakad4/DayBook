import sql from '../db/postgres.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import getUserProject from '../utils/getUserProject.js';

const passError = (error, next) => next(error instanceof ApiError ? error : new ApiError(500, error.message));

export const getStats = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    if (project_id) await getUserProject(project_id, req.user.id);
    const tasks = await sql`
      SELECT id, title, status, due_date, updated_at
      FROM tasks WHERE user_id = ${req.user.id} ${project_id ? sql`AND project_id = ${project_id}` : sql``}
    `;
    const todayString = new Date().toISOString().slice(0, 10);
    const formattedTasks = tasks.map((task) => ({
      ...task,
      due_date: task.due_date instanceof Date ? task.due_date.toISOString().slice(0, 10) : task.due_date,
      updated_at: task.updated_at instanceof Date ? task.updated_at.toISOString() : task.updated_at
    }));
    const dueSoon = formattedTasks
      .filter((task) => task.status !== 'done' && task.due_date && task.due_date >= todayString)
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .slice(0, 5);
    const overdue = formattedTasks.filter((task) => task.status !== 'done' && task.due_date && task.due_date < todayString).length;
    const weekly = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - index));
      const dateString = date.toISOString().slice(0, 10);
      const completedCount = formattedTasks.filter((task) => task.status === 'done' && task.updated_at?.slice(0, 10) === dateString).length;
      return { date: dateString, completedCount };
    });

    const data = {
      total: formattedTasks.length,
      todo: formattedTasks.filter((task) => task.status === 'todo').length,
      inProgress: formattedTasks.filter((task) => task.status === 'in_progress').length,
      done: formattedTasks.filter((task) => task.status === 'done').length,
      overdue,
      dueSoon,
      weekly
    };
    res.status(200).json(new ApiResponse(200, data, 'Stats fetched successfully'));
  } catch (error) { passError(error, next); }
};
