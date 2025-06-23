import express from 'express';
import logger from 'pino-http';
import mongoose from 'mongoose';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(logger());

// Налаштування Swagger UI з обробкою помилок
let swaggerDocument;
try {
  swaggerDocument = JSON.parse(
    readFileSync(join(__dirname, '../docs/swagger.json'), 'utf8'),
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error('Error loading swagger.json:', error.message);
  app.use('/api-docs', (req, res) => {
    res.status(500).json({
      status: 500,
      message: 'Failed to load API documentation',
      data: 'Please ensure swagger.json is generated.',
    });
  });
}

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Обробка невідомих роутів
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: 'Route not found',
  });
});

// Обробка помилок
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message,
    data: err.data || 'Internal Server Error',
  });
});

// Підключення до MongoDB
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

mongoose
  .connect(
    `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`,
  )
  .then(() => console.log('Mongo connection successfully established!'))
  .catch((error) => console.error('Mongo connection error:', error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
