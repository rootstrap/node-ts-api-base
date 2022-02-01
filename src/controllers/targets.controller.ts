import {
  JsonController,
  Body,
  Post,
  Authorized,
  BadRequestError,
  CurrentUser
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { TargetsService } from '@services/targets.service';
import { CreateTargetDTO } from '@dto/createTargetDTO';
import { Target } from '@entities/target.entity';
import { ITokenPayload } from 'src/interfaces/auth/auth.interface';

@JsonController('/targets')
@Service()
export class TargetController {
  constructor(private readonly targetsService: TargetsService) { }

  @Authorized()
  @Post()
  async createTarget(
    @Body() targetDTO: CreateTargetDTO,
    @CurrentUser() currentUser: ITokenPayload
  ): Promise<Target> {
    try {
      const target = await this.targetsService.createTarget(
        EntityMapper.mapTo(Target, targetDTO),
        currentUser.data.userId
      );
      return target;
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
