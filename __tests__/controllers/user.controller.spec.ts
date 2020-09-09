import request from 'supertest';
import connection from '../utils/connection';

let server: App;

beforeAll(async () => {
  server = new App();
});

describe('GET /hello', () => {
  // beforeAll(async () => {
  //   await connection.create();
  // });

  // afterAll(async () => {
  //   await connection.close();
  // });

  beforeEach(async () => {
    await connection.clear();
  });

  it('should return 200 & valid response if request param list is empity', async (done) => {
    request(server)
      .get(`/api/v1/users`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({ message: 'Hello, stranger!' });
        done();
      });
  });
});
