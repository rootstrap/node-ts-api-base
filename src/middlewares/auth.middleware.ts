import { Action } from 'routing-controllers';
import { JWTService } from '@services/jwt.service';
import { Container } from 'typedi';

export class AuthMiddleware {
  static async checker(action: Action): Promise<boolean> {
    const jwt = Container.get(JWTService);
    let token = action.request.headers['authorization'];
    if (!token) {
      return false;
    }

    if (token.startsWith('Bearer ')) {
      // Remove Bearer from authentication scheme header
      token = token.replace('Bearer ', '');
    }

    try {
      const payload = await jwt.verifyJWT(token);
      return payload !== null;
    } catch (error) {
      return false;
    }
  }
}
