import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContactsController } from './controllers/contacts.js';

export const setupServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Роути
  app.get('/contacts', getContactsController);

  // Обробка неіснуючих роутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
