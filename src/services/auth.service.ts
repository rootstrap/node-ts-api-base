import Container from 'typedi';
import { JWTService } from './jwt.service';
import { Action } from 'routing-controllers';

export class AuthorizationService {
  private static instance: AuthorizationService;

  public static getInstance(): AuthorizationService {
    if (!this.instance) {
      this.instance = new AuthorizationService();
    }

    return this.instance;
  }

  async authorizationChecker(
    action: Action,
    _roles: string[]
  ): Promise<boolean> {
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
