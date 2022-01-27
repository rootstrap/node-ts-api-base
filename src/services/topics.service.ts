import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Topic } from '@entities/topic.entity';

@Service()
export class TopicsService {
  private readonly topicRepository = getRepository<Topic>(Topic);

  async listTopics(): Promise<Topic[]> {
    return this.topicRepository.find();
  }
}
