import { Service } from 'typedi';
import * as nodeCron from 'node-cron';

@Service()
export class CronService {
  public static scheduleJob(
    cronExpression: string,
    a: () => void,
    options?: any
  ) {
    if (!nodeCron.validate(cronExpression)) {
      throw new Error('Invalid Cron expression');
    }
    nodeCron.schedule(cronExpression, a, options);
  }
}
