import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized
} from 'routing-controllers';
import {
  getRepository,
  InsertResult,
  UpdateResult,
  DeleteResult
} from 'typeorm';

import { User } from '@entities/user.entity';

@JsonController('/users')
export class UserController {
  private userRepository = getRepository<User>(User);

  @Authorized()
  @Get()
  index(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Get('/:id')
  show(@Param('id') id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  @Post()
  post(@Body() user: any): Promise<InsertResult> {
    return this.userRepository.insert(user);
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() user: any): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
