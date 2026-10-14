import sql from '../db/postgres.js';
import ApiError from './ApiError.js';

const getUserProject = async (projectId, userId) => {
  if (typeof projectId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    throw new ApiError(404, 'Project not found');
  }
  const [project] = await sql`
    SELECT * FROM projects WHERE id = ${projectId} AND owner_id = ${userId} LIMIT 1
  `;
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

export default getUserProject;
