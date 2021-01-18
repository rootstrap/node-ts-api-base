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
  InsertResult,
  UpdateResult,
  DeleteResult
} from 'typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';

@JsonController('/users')
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
  async post(@Body() user: User): Promise<InsertResult> {
    return this.usersService.createUser(user);
  }

  @Put('/:id')
  async put(@Param('id') id: number, @Body() user: User): Promise<UpdateResult> {
    return this.usersService.editUser(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }
}
