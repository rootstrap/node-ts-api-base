import { Action } from "routing-controllers";

const authCheck = async (action: Action): Promise<boolean> => {
  const token = action.request.headers["authorization"];
  // check if the request may access the resource
  return token !== undefined;
}

export default authCheck;
