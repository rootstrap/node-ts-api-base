import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getConnectionManager } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import config from '@ormconfig';

@Service()
export class UsersService {
  
  // constructor(private readonly jwtService: JWTService, private readonly userRepository: Repository<User>) {}
  constructor(private readonly jwtService: JWTService) {}

  private manager = getConnectionManager().get();

  private readonly userRepository = this.manager.getRepository<User>(User);


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
    try {
      return this.userRepository.find();
    } catch (error) {
      console.log(error);
    } finally {
      return [];
    }
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
