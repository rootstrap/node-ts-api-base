import request from 'supertest';
import app from '@app';
import { API } from '../utils';
import { RATE_LIMIT_MAX_REQUESTS } from '@config';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';

describe('RateMiddleware', () => {
  describe('calling multiple times an endpoint', () => {
    it('returns http code 429 with message too many requests', async () => {
      for (
        let index = 0;
        index < Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100');
        index++
      ) {
        await request(app).post(`${API}/auth/signin`);
      }
      const response = await request(app).post(`${API}/auth/signin`);
      expect(response.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          message: ErrorsMessages.TOO_MANY_REQUESTS_ERROR,
          status: HttpStatusCode.TOO_MANY_REQUESTS
        })
      );
    });
  });
});
