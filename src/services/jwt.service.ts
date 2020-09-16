import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET } from '@config';

export const createJWT = (user: User) => {
  return jwt.sign(
    { data: { userId: user.id, email: user.email } },
    JWT_SECRET || '',
    { expiresIn: '6h' }
  );
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token);
};
