import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('creating an account', () => {
  it('returns http code 200 with valid params', async () => {
    const userFields = await factory(User)().make();
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 400 with invalid params', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
  });

  it('returns http code 400 with 8 errors on the errors field', async () => {
    const userFields = {};
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
