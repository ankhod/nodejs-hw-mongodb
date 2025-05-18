import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
  });
};
