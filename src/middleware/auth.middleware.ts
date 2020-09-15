import { Action } from 'routing-controllers';
import { verifyJWT } from '@services/jwt.service';

const authCheck = async (action: Action): Promise<boolean> => {
  const token = action.request.headers['authorization'];
  // check if the request may access the resource
  verifyJWT(token);
  return token !== undefined;
};

export default authorizationChecker;
