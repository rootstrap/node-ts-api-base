import {
  JsonController,
  Get,
  Authorized
} from 'routing-controllers';
import { Service } from 'typedi';
import { TopicsService } from '@services/topics.service';
import { Topic } from '@entities/topic.entity';


@JsonController('/topics')
@Service()
export class TopicController {
  constructor(private readonly topicsService: TopicsService) { }

  @Authorized()
  @Get()
  async index(): Promise<Topic[]> {
    return this.topicsService.listTopics();
  }
}
