import { User } from '@entities/user.entity';

export interface IEditUserInput {
  id: number;
  user: User;
}
