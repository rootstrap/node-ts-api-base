import request from 'supertest';
import { factory } from 'typeorm-seeding';
import { Container } from 'typedi';
import app from '@app';
import { JWTService } from '@services/jwt.service';
import { API } from '../utils';
import { User } from '@entities/user.entity';
import { Topic } from '@entities/topic.entity';
import { UnauthorizedError } from '@exception/unauthorized.error';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { TopicsService } from '@services/topics.service';
import { TopicController } from '../../src/controllers/topic.controller';

describe('TopicController', () => {
  describe('listTopics', () => {
    let user: User;
    let token: string;
    let topic: Topic;
    let topicsService: TopicsService;
    let topicController: TopicController;
    let jwtService: JWTService;

    beforeAll(() => {
      topicsService = Container.get(TopicsService);
      jwtService = Container.get(JWTService);
      topicController = Container.get(TopicController);
    });

    beforeEach(async () => {
      user = await factory(User)().create();
      topic = await factory(Topic)().create();
      token = await jwtService.createJWT(user);
    });

    it('all dependencies should be defined', () => {
      expect(jwtService).toBeDefined();
      expect(topicsService).toBeDefined();
      expect(topicController).toBeDefined();
    });

    it('returns list of topics', async () => {
      jest.spyOn(topicsService, 'listTopics')
        .mockResolvedValueOnce([topic]);
      const topics = await topicController.listTopics();
      expect(topics).toBeInstanceOf(Array);
      expect(topics).not.toEqual([]);
    });

    it('returns empty array if no topics found', async () => {
      jest.spyOn(topicsService, 'listTopics')
        .mockResolvedValueOnce([]);
      const topics = await topicController.listTopics();
      expect(topics).toBeInstanceOf(Array);
      expect(topics).toEqual([]);
    });

    it('returns http code 401 without authentication token', async () => {
      const response = await request(app).get(`${API}/topics`);
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toStrictEqual(
        expect.objectContaining(new UnauthorizedError('GET /api/v1/topics'))
      );
    });

    it('returns http code 401 with an invalid authentication token', async () => {
      const response = await request(app)
        .get(`${API}/topics`)
        .set({ Authorization: 'Inv3nT3d-T0k3N' });
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toStrictEqual(
        expect.objectContaining(new UnauthorizedError('GET /api/v1/topics'))
      );
    });

    it('returns http code 200 with valid authentication token', async () => {
      const response = await request(app)
        .get(`${API}/topics`)
        .set({ Authorization: token });
      expect(response.status).toBe(HttpStatusCode.OK);
    });

    it("returns the topics' list", async () => {
      const response = await request(app)
        .get(`${API}/topics`)
        .set({ Authorization: token });
      expect(response.header).toHaveProperty(
        'content-type',
        'application/json; charset=utf-8'
      );
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).not.toEqual([]);
    });
  });
});


