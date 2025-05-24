import Joi from 'joi';
import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return next(createHttpError(400, errorMessage));
    }
    next();
  };
};
