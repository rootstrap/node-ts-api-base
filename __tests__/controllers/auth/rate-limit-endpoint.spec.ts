import request from 'supertest';
import app from '@app';
import { API } from '../../utils';
import { RATE_LIMIT_MAX_REQUESTS } from '@config';

describe('calling multiple times an endpoint', () => {
  it('returns http code 429 with message too many requests', async () => {
    let response;
    for (
      let index = 0;
      index < Number.parseInt(RATE_LIMIT_MAX_REQUESTS || '100') + 1;
      index++
    ) {
      response = await request(app).post(`${API}/auth/signin`);
    }
    expect(response.status).toBe(429);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: expect.any(Number)
      })
    );
  });
});
