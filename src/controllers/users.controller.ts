import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  Res
} from 'routing-controllers';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { SignUpDTO } from '@dto/signUpDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { omit } from 'lodash';
import { Response } from 'express';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Authorized()
  @Get()
  async index(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  @Get('/:id')
  async show(@Param('id') id: number): Promise<User | undefined> {
    return this.usersService.showUser(id);
  }

  @Post()
  async post(@Body() userDTO: SignUpDTO, @Res() response: Response<User>) {
    const newUser = await this.usersService.createUser(
      EntityMapper.mapTo(User, userDTO)
    );
    return response.send(<User>omit(newUser, ['password']));
  }

  @Put('/:id')
  async put(
    @Param('id') id: number,
    @Body() userDTO: SignUpDTO
  ): Promise<UpdateResult> {
    const user: User = EntityMapper.mapTo(User, userDTO);
    return this.usersService.editUser({ id, user });
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }
}
