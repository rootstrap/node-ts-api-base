import { Service } from 'typedi';
import * as nodeCron from 'node-cron';

@Service()
export class CronService {
  public static isValidCronExpression(cronExpression: string) {
    return nodeCron.validate(cronExpression);
  }
}
