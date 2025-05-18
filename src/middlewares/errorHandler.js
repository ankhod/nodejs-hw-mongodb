import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Завжди встановлюємо JSON як тип відповіді
  res.setHeader('Content-Type', 'application/json');

  // Обробка помилок від MongoDB (наприклад, CastError)
  if (err.name === 'CastError') {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: 'Invalid contactId format',
    });
  }

  // Обробка помилок, створених через http-errors
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.message,
    });
  }

  // Для всіх інших помилок
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
  });
};
