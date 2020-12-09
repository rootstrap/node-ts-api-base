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
  private readonly userRepository = getRepository<User>(User);

  @Authorized()
  @Get()
  async index(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Get('/:id')
  async show(@Param('id') id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  @Post()
  async post(@Body() user: User): Promise<InsertResult> {
    return this.userRepository.insert(user);
  }

  @Put('/:id')
  async put(@Param('id') id: number, @Body() user: User): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
