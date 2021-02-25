import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) {}

  private readonly userRepository = getRepository<User>(User);

  givenCredentials(email: string, password: string): boolean {
    return !!(email && password);
  }

  comparePassword(password: string, userPass: string): boolean {
    return compareSync(password, userPass);
  }

  generateToken(user: User) {
    return this.jwtService.createJWT(user);
  }

  hashPassword(password: string): string {
    return hashSync(password, genSaltSync());
  }

  listUsers() {
    return this.userRepository.find();
  }

  showUser(id: number) {
    return this.userRepository.findOne(id);
  }

  createUser(user: User) {
    return this.userRepository.insert(user);
  }

  editUser(id: number, user: User) {
    return this.userRepository.update(id, user);
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }
}
