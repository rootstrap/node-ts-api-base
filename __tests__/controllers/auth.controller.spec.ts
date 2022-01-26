import request from 'supertest';
import app from '@app';
import { API } from '../utils';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { AuthController } from '../../src/controllers/auth.controller';
import { Container } from 'typedi';
import { SessionService } from '@services/session.service';
import { User } from '@entities/user.entity';
import { factory } from 'typeorm-seeding';
import { SignUpDTO } from '@dto/signUpDTO';
import { EmailService } from '@services/email.service';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { genSaltSync, hashSync } from 'bcrypt';
import { JWTService } from '@services/jwt.service';

let authController: AuthController;
let sessionService: SessionService;
let userFields: User;
const req = getMockReq();
const { res, mockClear } = getMockRes();


describe('AuthController', () => {
  beforeAll(async () => {
    authController = Container.get(AuthController);
    sessionService = Container.get(SessionService);
    userFields = await factory(User)().make();
  });

  beforeEach(() => {
    mockClear();
  });

  it('all dependencies should be defined', () => {
    expect(authController).toBeDefined();
    expect(sessionService).toBeDefined();
  });
  describe('signup', () => {
    it('throw error if fails sending the verification email', async () => {
      const signUPDTO = await factory(SignUpDTO)().make();

      jest.spyOn(sessionService, 'signUp').mockResolvedValueOnce(userFields);
      jest.spyOn(EmailService, 'sendEmail').mockRejectedValueOnce(new Error('Error'));

      const responseObject = authController.signUp(
        signUPDTO,
        req,
        res
      );
      await expect(responseObject).rejects.toThrowError(Error);
    });

    it('sends the verification email', async () => {
      const signUPDTO = await factory(SignUpDTO)().make();

      jest.spyOn(sessionService, 'signUp').mockResolvedValueOnce(userFields);
      jest.spyOn(EmailService, 'sendEmail').mockResolvedValueOnce(true);

      await authController.signUp(
        signUPDTO,
        req,
        res
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userFields.email
        })
      );
    });
    it('returns http code 200 with valid params', async () => {
      jest.spyOn(EmailService, 'sendEmail').mockResolvedValueOnce(true);

      const response = await request(app)
        .post(`${API}/auth/signup`)
        .send(userFields);
      expect(response.status).toBe(200);
    });

    it('returns http code 400 with invalid params', async () => {
      const response = await request(app)
        .post(`${API}/auth/signup`)
        .send({});
      expect(response.status).toBe(400);
    });

    it('returns http code 400 with 8 errors on the errors field', async () => {
      const response = await request(app)
        .post(`${API}/auth/signup`)
        .send({});
      expect(response.body).toStrictEqual({
        description: ErrorsMessages.BODY_ERRORS,
        errors: [
          ErrorsMessages.USER_FIRST_NAME_NOT_EMPTY,
          ErrorsMessages.USER_FIRST_NAME_STRING,
          ErrorsMessages.USER_LAST_NAME_NOT_EMPTY,
          ErrorsMessages.USER_LAST_NAME_STRING,
          ErrorsMessages.USER_GENDER_ENUM,
          ErrorsMessages.USER_GENDER_NOT_EMPTY,
          ErrorsMessages.EMAIL_NOT_EMAIL,
          ErrorsMessages.PASSWORD_ERROR
        ],
        httpCode: HttpStatusCode.BAD_REQUEST,
        name: ErrorsMessages.BAD_REQUEST_ERROR
      });
      expect(response.body.errors).toHaveLength(8);
    });
    describe('signin', () => {
      let email: string;
      let password: string;
      let hashedPassword: string;

      beforeEach(async () => {
        hashedPassword = hashSync('password123', genSaltSync());
        const user = await factory(User)().create({ password: hashedPassword });
        email = user.email;
        password = 'password123';
      });

      it('returns http code 200 whith valid params', async () => {
        const authFields = {
          email,
          password
        };
        const response = await request(app)
          .post(`${API}/auth/signin`)
          .send(authFields);
        expect(response.status).toBe(HttpStatusCode.OK);
      });
      it('returns http code 401 whith invalid params', async () => {
        const authFields = {
          email: 'r4nD0m@3M4Il.com',
          password: 'r4Nd0mPa55w0rD'
        };
        const response = await request(app)
          .post(`${API}/auth/signin`)
          .send(authFields);
        expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(response.body).toStrictEqual({
          description: ErrorsMessages.INVALID_CREDENTIALS,
          httpCode: HttpStatusCode.UNAUTHORIZED,
          name: 'Error'
        });
      });
    });
    describe('logout', () => {
      let email: string;
      let password: string;
      let hashedPassword: string;
      let token: string;
      const jwtService = Container.get(JWTService);

      beforeEach(async () => {
        hashedPassword = hashSync('password123', genSaltSync());
        const user = await factory(User)().create({ password: hashedPassword });
        email = user.email;
        password = 'password123';
        token = await jwtService.createJWT(user);
      });

      it('returns http code 200 because was a correct logout', async () => {
        const authFields = {
          email,
          password
        };
        const response = await request(app)
          .post(`${API}/auth/logout`)
          .set({ Authorization: token })
          .send(authFields);
        expect(response.status).toBe(200);
      });

      it('returns http code 200 when the token starts with Bearer word', async () => {
        const authFields = {
          email,
          password
        };

        const tokenWithBearer = 'Bearer ' + token;

        const response = await request(app)
          .post(`${API}/auth/logout`)
          .set({ Authorization: tokenWithBearer })
          .send(authFields);
        expect(response.status).toBe(200);
      });

      it('returns http code 401 because the token was invalidated', async () => {
        const authFields = {
          email,
          password
        };
        await request(app)
          .post(`${API}/auth/logout`)
          .set({ Authorization: token })
          .send(authFields);
        const response = await request(app)
          .post(`${API}/auth/logout`)
          .set({ Authorization: token })
          .send(authFields);
        expect(response.status).toBe(401);
      });
    });
  });
});
