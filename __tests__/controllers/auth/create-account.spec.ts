import request from 'supertest';
import app from '@app';
import { API } from '../../utils';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { AuthController } from '../../../src/controllers/auth.controller';
import { Container } from 'typedi';
import { SessionService } from '@services/session.service';
import { User } from '@entities/user.entity';
import { factory } from 'typeorm-seeding';
import { SignUpDTO } from '@dto/signUpDTO';
import { mockResponse, mockRequest } from '../../utils/mocks';
import { Request, Response } from 'express';
import { EmailService } from '@services/email.service';

let authController: AuthController;
let sessionService: SessionService;
let userFields;

describe('creating an account', () => {
  beforeAll(async () => {
    authController = Container.get(AuthController);
    sessionService = Container.get(SessionService);
    userFields = await factory(User)().make();
  });

  it('all dependencies should be defined', () => {
    expect(authController).toBeDefined();
    expect(sessionService).toBeDefined();
  });

  it('sends the verification email', async () => {
    const signUPDTO = await factory(SignUpDTO)().make();

    jest.spyOn(sessionService, 'signUp').mockResolvedValueOnce(userFields);
    jest.spyOn(EmailService, 'sendEmail').mockResolvedValueOnce(true);

    const response = await authController.signUp(
      signUPDTO,
      mockRequest as Request,
      mockResponse as Response
    );
    expect(response).toHaveProperty('email');
  });

  it('does not send the verification email', async () => {
    const signUPDTO = await factory(SignUpDTO)().make();

    jest.spyOn(sessionService, 'signUp').mockResolvedValueOnce(userFields);
    jest.spyOn(EmailService, 'sendEmail').mockRejectedValueOnce(new Error('Error'));

    const responseObject = authController.signUp(
      signUPDTO,
      mockRequest as Request,
      mockResponse as Response
    );
    await expect(responseObject).rejects.toThrowError(Error);
  });

  it('returns http code 200 with valid params', async () => {
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 400 with invalid params', async () => {
    userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
  });

  it('returns http code 400 with 8 errors on the errors field', async () => {
    userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
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
      name: 'Bad request error'
    });
    expect(response.body.errors).toHaveLength(8);
  });
});
