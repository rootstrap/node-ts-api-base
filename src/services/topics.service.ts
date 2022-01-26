import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Topic } from '@entities/topic.entity';

@Service()
export class TopicsService {
  private readonly topicRepository = getRepository<Topic>(Topic);

  listTopics(): Promise<Topic[]> {
    return this.topicRepository.find();
  }
}
