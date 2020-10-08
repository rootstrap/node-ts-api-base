import { User } from '@entities/user.entity';
import { getRepository } from 'typeorm';

export const API = '/api/v1';

const confirmedUser = async (user: User): Promise<User> => {
  user.confirmedAt = new Date();
  await user.save();
  return user;
};

export { confirmedUser };
