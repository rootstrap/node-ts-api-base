import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET, ACCESS_TOKEN_LIFE } from '@config';

export const createJWT = (user: User): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        { data: { userId: user.id, email: user.email } },
        JWT_SECRET || '',
        { expiresIn: ACCESS_TOKEN_LIFE || 21600 }
      );
      resolve(token);
    } catch (error) {
      console.log('decode error: ', error);
      reject(new Error('Error creating JWT'));
    }
  });
};

export const decodeJWT = (
  token: string
): Promise<string | { [key: string]: any } | null> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.decode(token);
      resolve(decoded);
    } catch (error) {
      console.log('decode error: ', error);
      reject(new Error('Error decoding JWT'));
    }
  });
};
