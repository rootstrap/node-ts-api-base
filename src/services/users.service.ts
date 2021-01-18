import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { Errors } from '@constants/errorMessages';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) {}

  private readonly userRepository = getRepository<User>(User);

  givenCrentials(email: string, password: string): boolean {
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

  async signUp(user: User) {
    let newUser: User;

    try {
      newUser = await this.userRepository.save(user);
    } catch (error) {
      throw new Error(Errors.MISSING_PARAMS);
    }

    return newUser;
  }

  async signIn(email: string, password: string) {
    if (!this.givenCrentials(email, password)) {
      throw new Error('Missing params on body');
    }

    let user: User;
    try {
      user = await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new Error('UnauthorizedError');
    }

    // Check if encrypted password match
    if (!this.comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    // user matches email + password, create a token
    const token = this.generateToken(user);
    user.password = this.hashPassword(user.password);
    return token;
  }

  index() {
    return this.userRepository.find();
  }

  show(id: number) {
    return this.userRepository.findOne(id);
  }

  post(user: User) {
    return this.userRepository.insert(user);
  }

  put(id: number, user: User) {
    return this.userRepository.update(id, user);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }
}
