import { Action } from 'routing-controllers';

export interface ISignInInput {
  email: string;
  password: string;
}

export interface IComparePasswordInput {
  password: string;
  userPassword: string;
}

export interface IAuthorizationCheckerInput {
  action: Action;
  roles?: string[];
}
