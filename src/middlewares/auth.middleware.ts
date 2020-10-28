import { Action } from 'routing-controllers';
import { verifyJWT } from '@services/jwt.service';

export default class {
  static async checker(action: Action): Promise<boolean> {
    let token = action.request.headers['authorization'];
    if (!token) {
      return false;
    }

    if (token.startsWith('Bearer ')) {
      // Remove Bearer from authentication scheme header
      token = token.replace('Bearer ', '');
    }

    try {
      const payload = await verifyJWT(token);
      return payload !== null;
    } catch (error) {
      return false;
    }
  }
}
