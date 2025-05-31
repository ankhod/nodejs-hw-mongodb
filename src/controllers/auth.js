import { registerUser, loginUser } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginUser({ email, password });

  // Записуємо refreshToken у cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  await logoutUser(refreshToken);

  res.clearCookie('refreshToken');
  res.status(204).send();
};
