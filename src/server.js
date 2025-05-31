import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; // Додаємо authRouter
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Примусово встановлюємо Content-Type для всіх відповідей
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter); // Додаємо роути для автентифікації

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
