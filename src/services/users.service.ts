import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { AuthInterface, UserInterface } from '@interfaces';
import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from '@exception/base.error';
import { HttpStatusCode } from '@constants/httpStatusCode';

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

  listUsers() {
    return this.userRepository.find();
  }

  showUser(id: number) {
    return this.userRepository.findOne(id);
  }

  createUser(user: User) {
    this.hashUserPassword(user);
    return this.userRepository.insert(user);
  }

  editUser(input: UserInterface.IEditUserInput) {
    const { id, user } = input;
    return this.userRepository.update(id, user);
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  async verifyUser(verifyHash: string) {
    const user = await this.userRepository.findOne({ verifyHash });
    if (!user) {
      throw new BaseError('Error',
        HttpStatusCode.BAD_REQUEST,
        ErrorsMessages.HASH_NOT_VALID
      );
    }
    if (new Date(user.hashExpiresAt) < new Date()) {
      throw new BaseError('Error',
        HttpStatusCode.NOT_ACCEPTABLE,
        ErrorsMessages.HASH_EXPIRED
      );
    }
    user.verified = true;
    user.verifyHash = null;
    user.hashExpiresAt = null;
    await this.userRepository.update(user.id, user);
    return user;
  }
}
