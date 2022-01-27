import { Container } from 'typedi';
import { TopicsService } from '@services/topics.service';
import { Topic } from '@entities/topic.entity';
import { factory } from 'typeorm-seeding';
import { getRepository, Repository } from 'typeorm';

let topicsService: TopicsService;
let topicRepository: Repository<Topic>;
let topic: Topic;

describe('TopicsService', () => {
  beforeAll( () => {
    topicsService = Container.get(TopicsService);
    topicRepository = getRepository<Topic>(Topic);
  });

  it('all dependencies should be defined', () => {
    expect(topicsService).toBeDefined();
    expect(topicRepository).toBeDefined();
  });

  describe('listTopics', () => {
    beforeEach(async () => {
      topic = await factory(Topic)().make();
    });

    it('returns the topics list', async () => {
      jest.spyOn(topicRepository, 'find')
        .mockResolvedValueOnce([topic]);
      const response = await topicsService.listTopics();
      expect(response).toBeInstanceOf(Array);
      expect(response).not.toEqual([]);
    });

    it('returns empty array if no topics found', async () => {
      jest.spyOn(topicRepository, 'find')
        .mockResolvedValueOnce([]);
      const response = await topicsService.listTopics();
      expect(response).toBeInstanceOf(Array);
      expect(response).toEqual([]);
    });
  });
});
