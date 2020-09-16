import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET, ACCESS_TOKEN_LIFE } from '@config';

export const createJWT = (user: User) => {
  return jwt.sign(
    { data: { userId: user.id, email: user.email } },
    JWT_SECRET || '',
    { expiresIn: ACCESS_TOKEN_LIFE || 360 }
  );
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token);
};
