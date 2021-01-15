import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) {}

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
}
