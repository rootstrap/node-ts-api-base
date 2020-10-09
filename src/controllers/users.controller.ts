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
  async index(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Get('/:id')
  async show(@Param('id') id: number): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  @Post()
  async post(@Body() user: any): Promise<InsertResult> {
    return await this.userRepository.insert(user);
  }

  @Put('/:id')
  async put(@Param('id') id: number, @Body() user: any): Promise<UpdateResult> {
    return await this.userRepository.update(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
