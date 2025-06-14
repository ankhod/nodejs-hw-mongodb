import express from 'express';
import logger from 'pino-http';
import mongoose from 'mongoose';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

const app = express();

app.use(express.json());
app.use(logger());

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message,
    data: err.data || 'Internal Server Error',
  });
});

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

mongoose
  .connect(
    `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`,
  )
  .then(() => console.log('Mongo connection successfully established!'))
  .catch((error) => {
    console.error('Mongo connection error details:', {
      message: error.message,
      stack: error.stack,
      env: process.env.MONGODB_URL,
    });
    throw error;
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
