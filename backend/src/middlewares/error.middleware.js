import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const errorMiddleware = (error, req, res, next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : 'Internal server error';

  if (statusCode === 500) console.error(error);
  res.status(statusCode).json(new ApiResponse(statusCode, null, message));
};

export default errorMiddleware;
