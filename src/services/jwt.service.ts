import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET, ACCESS_TOKEN_LIFE, JWT_SECRET_DEFAULT } from '@config';
import { Service } from 'typedi';
import { AuthInterface } from '@interfaces';

@Service()
export class JWTService {
  async createJWT(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(
          { data: { userId: user.id, email: user.email } },
          JWT_SECRET || JWT_SECRET_DEFAULT,
          { expiresIn: ACCESS_TOKEN_LIFE || '6h' }
        );
        resolve(token);
      } catch (error) {
        reject(new Error('Error creating JWT'));
      }
    });
  }

  async decodeJWT(
    token: string
  ): Promise<string | { [key: string]: any } | null> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        resolve(decoded);
      } catch (error) {
        reject(new Error('Error decoding JWT'));
      }
    });
  }

  async verifyJWT(token = ''): Promise<AuthInterface.ITokenPayload> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(
          token,
          JWT_SECRET || JWT_SECRET_DEFAULT
        ) as AuthInterface.ITokenPayload;
        resolve(decoded);
      } catch (error) {
        reject(new Error('Error verifying JWT'));
      }
    });
  }
}
