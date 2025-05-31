import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Видаляємо пароль із поверненого об’єкта
  user.password = undefined;
  return user;
};
