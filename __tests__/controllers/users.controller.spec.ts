import request from 'supertest';
import { factory } from 'typeorm-seeding';
import { Container } from 'typedi';
import app from '@app';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { API } from '../utils';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { UserNotFoundError } from '@exception/users/user-not-found.error';
import { HashExpiredError } from '@exception/users/hash-expired.error';
import { HashInvalidError } from '@exception/users/hash-invalid.error';
import { getRepository } from 'typeorm';
import { ErrorsMessages } from '@constants/errorMessages';
import { UnauthorizedError } from '@exception/unauthorized.error';

let jwtService = Container.get(JWTService);
let user: User;
let token: string;

describe('UsersController', () => {
  beforeAll( () => {
    jwtService = Container.get(JWTService);
  });

  it('all dependencies should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('index', () => {
    beforeEach(async () => {
      user = await factory(User)().create();
      token = await jwtService.createJWT(user);
    });

    it('returns http code 401 without authentication token', async () => {
      const response = await request(app).get(`${API}/users`);
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toStrictEqual(
        expect.objectContaining(new UnauthorizedError('GET /api/v1/users'))
      );
    });

    it('returns http code 401 with an invalid authentication token', async () => {
      const response = await request(app)
        .get(`${API}/users`)
        .set({ Authorization: 'Inv3nT3d-T0k3N' });
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toStrictEqual(
        expect.objectContaining(new UnauthorizedError('GET /api/v1/users'))
      );
    });

    it('returns http code 200 with valid authentication token', async () => {
      const response = await request(app)
        .get(`${API}/users`)
        .set({ Authorization: token });
      expect(response.status).toBe(HttpStatusCode.OK);
    });

    it("returns the user's list", async () => {
      const response = await request(app)
        .get(`${API}/users`)
        .set({ Authorization: token });
      expect(response.header).toHaveProperty(
        'content-type',
        'application/json; charset=utf-8'
      );
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).not.toEqual([]);
    });
  });

  describe('verify', () => {
    beforeEach(async () => {
      user = await factory(User)().create();
    });

    it('returns http code 500 if expired hash', async () => {
      user = await factory(User)().create({ hashExpiresAt: new Date() });
      const failingResponse = await request(app)
        .get(`${API}/users/verify/?key=${user.verifyHash}`);
      expect(failingResponse.status).toBe(HttpStatusCode.NOT_ACCEPTABLE);
      expect(failingResponse.body).toStrictEqual(
        expect.objectContaining(new HashExpiredError())
      );
    });

    it('returns http code 400 if invalid hash', async () => {
      user.verifyHash = '11111111-2222-3333-4444-555555555555';
      const failingResponse = await request(app)
        .get(`${API}/users/verify/?key=${user.verifyHash}`);
      expect(failingResponse.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(failingResponse.body).toStrictEqual(
        expect.objectContaining(new HashInvalidError())
      );
    });

    it('returns http code 200 with valid params', async () => {
      const response = await request(app)
        .get(`${API}/users/verify/?key=${user.verifyHash}`);
      expect(response.status).toBe(200);
      expect(response.body.verified).toBe(true);
      expect(response.body.hashExpiresAt).toBe(null);
      expect(response.body.verifyHash).toBe(null);
    });
  });

  describe('show', () => {
    beforeEach(async () => {
      user = await factory(User)().create();
    });

    it('returns http code 404 for non-existing user', async () => {
      const randomId = Math.round(user.id + (1 + Math.random() * 10));
      const response = await request(app).get(`${API}/users/${randomId}`);
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toStrictEqual(
        expect.objectContaining(new UserNotFoundError())
      );
    });

    it('returns http code 200 for an existing user', async () => {
      const id = user.id;
      const response = await request(app).get(`${API}/users/${id}`);
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('post', () => {
    it('returns http code 200 and creates the user', async () => {
      const userFields = await factory(User)().make();

      const response = await request(app).post(`${API}/users`).send(userFields);
      expect(response.status).toBe(200);

      const userRepo = getRepository<User>(User);
      expect(await userRepo.count()).toBeGreaterThan(0);
    });

    it('returns http code 400 if email is incorrect', async () => {
      const userFields = await factory(User)().make();
      userFields.email = '';

      const response = await request(app).post(`${API}/users`).send(userFields);
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

      expect(response.body).toStrictEqual({
        description: ErrorsMessages.BODY_ERRORS,
        httpCode: HttpStatusCode.BAD_REQUEST,
        errors: [ErrorsMessages.EMAIL_NOT_EMAIL],
        name: ErrorsMessages.BAD_REQUEST_ERROR
      });
    });

    it('returns http code 400 if password is incorrect', async () => {
      const userFields = await factory(User)().make();
      userFields.password = '';

      const response = await request(app).post(`${API}/users`).send(userFields);
      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

      expect(response.body).toStrictEqual({
        description: ErrorsMessages.BODY_ERRORS,
        httpCode: HttpStatusCode.BAD_REQUEST,
        errors: [ErrorsMessages.PASSWORD_ERROR],
        name: ErrorsMessages.BAD_REQUEST_ERROR
      });
    });

    it('returns http code 400 if user email already exists', async () => {
      const userFields = await factory(User)().create();

      const userRepo = getRepository<User>(User);
      userRepo.delete({});

      const validResponse = await request(app)
        .post(`${API}/users`)
        .send(userFields);
      expect(validResponse.status).toBe(200);

      const failingResponse = await request(app)
        .post(`${API}/users`)
        .send(userFields);
      expect(failingResponse.status).toBe(400);
      expect(failingResponse.body).toStrictEqual({
        description: expect.stringContaining(userFields.email),
        httpCode: HttpStatusCode.BAD_REQUEST,
        name: 'BadRequestError'
      });

      expect(await userRepo.count()).toBe(1);
    });
  });

  describe('put', () => {
    let user: User;
    let newUser: User;

    beforeEach(async () => {
      user = await factory(User)().create();
    });

    it('returns http code 200 and updates the user', async () => {
      newUser = await factory(User)().create();

      const id = user.id;
      user.firstName = newUser.firstName;
      user.lastName = newUser.lastName;
      user.gender = newUser.gender;

      const response = await request(app).put(`${API}/users/${id}`).send(user);
      expect(response.status).toBe(200);

      const updatedUser = await getRepository(User).findOne(id);
      expect(updatedUser?.firstName).toEqual(user.firstName);
      expect(updatedUser?.lastName).toEqual(user.lastName);
      expect(updatedUser?.gender).toEqual(user.gender);
    });
  });

  describe('delete', () => {
    let user: User;

    beforeEach(async () => {
      user = await factory(User)().create({ password: 'password123' });
    });

    it('returns http code 200 and deletes the user', async () => {
      const id = user.id;
      const userRepo = getRepository<User>(User);
      const beforeCount = await userRepo.count();
      const response = await request(app).delete(`${API}/users/${id}`);

      expect(response.status).toBe(200);
      expect(await userRepo.count()).toBeLessThan(beforeCount);
    });
  });
});
