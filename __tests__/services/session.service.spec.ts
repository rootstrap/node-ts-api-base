import { Container } from 'typedi';
import { SessionService } from '@services/session.service';

let sessionService: SessionService;

describe('SessionService', () => {
  beforeAll(() => {
    sessionService = Container.get(SessionService);
  });

  it('all dependencies should be defined', () => {
    expect(sessionService).toBeDefined();
  });
});
