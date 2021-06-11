import Container from 'typedi';
import { JWTService } from './jwt.service';
import { AuthInterface } from '@interfaces';

export class AuthorizationService {
  private static instance: AuthorizationService;

  public static getInstance(): AuthorizationService {
    if (!this.instance) {
      this.instance = new AuthorizationService();
    }

    return this.instance;
  }

  async authorizationChecker(
    input: AuthInterface.IAuthorizationCheckerInput
  ): Promise<boolean> {
    const { action } = input;
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
