import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/utility/decorator/user.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { updateUserDTO } from './dto/updateUser.dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private service: UserService) {}

  /**
   * @example ['admin']
   *
   */
  @Get()
  async getAll(@User('id') id: string): Promise<UserDTO[]> {
    console.log(id);
    return await this.service.getAll();
  }

  @Post()
  public async create(@Body() dto: CreateUserDTO): Promise<UserDTO> {
    return this.service.create(dto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.delete(id);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateData: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.service.update(id, updateData);
  }
}
