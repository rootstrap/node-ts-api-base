import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Target } from '@entities/target.entity';
import { TargetNotSavedException } from '@exception/targets/target-not-saved.exception';
import { TargetErrorsMessages } from '@constants/errorMessages';

@Service()
export class TargetsService {
  private readonly targetRepository = getRepository<Target>(Target);

  async canCreateTargets(userId: number): Promise<boolean> {
    try {
      const numberTargets = await this.targetRepository.count({ where: { userId } });
      return numberTargets < 10;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async createTarget(target: Target, userId: number): Promise<Target> {
    try {
      const canCreate = await this.canCreateTargets(userId);
      if (!canCreate) {
        throw new Error(TargetErrorsMessages.TARGET_USER_MORE_10);
      }
      target.userId = userId;
      const targetResult = await this.targetRepository.save(target);
      return targetResult;
    } catch (error) {
      throw new TargetNotSavedException(`${error}`);
    }
  }
}
