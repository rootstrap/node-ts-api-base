import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { DeleteResult, getRepository, InsertResult, UpdateResult } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { AuthInterface, UserInterface } from '@interfaces';
import { UserNotFoundError } from '@exception/users/user-not-found.error';
import { HashInvalidError } from '@exception/users/hash-invalid.error';
import { HashExpiredError } from '@exception/users/hash-expired.error';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) { }

  private readonly userRepository = getRepository<User>(User);

  comparePassword(input: AuthInterface.IComparePasswordInput): boolean {
    const { password, userPassword } = input;
    return compareSync(password, userPassword);
  }

  generateToken(user: User) {
    return this.jwtService.createJWT(user);
  }

  hashPassword(password: string): string {
    return hashSync(password, genSaltSync());
  }

  hashUserPassword(user: User): void {
    user.password = this.hashPassword(user.password);
  }

  listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async showUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new UserNotFoundError( );
    }
    return user;
  }

  async showUserByHash(verifyHash: string): Promise<User> {
    const user = await this.userRepository.findOne({ verifyHash });
    if (!user) {
      throw new HashInvalidError( );
    }
    return user;
  }

  createUser(user: User): Promise<InsertResult> {
    this.hashUserPassword(user);
    return this.userRepository.insert(user);
  }

  editUser(input: UserInterface.IEditUserInput): Promise<UpdateResult> {
    const { id, user } = input;
    return this.userRepository.update(id, user);
  }

  deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async verifyUser(verifyHash: string): Promise<User> {
    const user = await this.showUserByHash(verifyHash);
    if (new Date(user.hashExpiresAt) < new Date()) {
      throw new HashExpiredError();
    }
    user.verified = true;
    user.verifyHash = null;
    user.hashExpiresAt = null;
    await this.userRepository.update(user.id, user);
    return user;
  }
}
