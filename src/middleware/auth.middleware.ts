import { Action } from 'routing-controllers';
import { decodeJWT } from '@services/jwt.service';

const authorizationChecker = async (action: Action): Promise<boolean> => {
  const token = action.request.headers['authorization'];
  const payload = decodeJWT(token);
  return payload !== null;
};

export default authorizationChecker;
