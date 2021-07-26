import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/utility/decorator/auth.decorator';
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
  @Auth()
  async getAll(@User('id') id: string): Promise<UserDTO[]> {
    console.log(id);
    return await this.service.getAll();
  }

  @Post()
  @Auth()
  public async create(
    @User('id') createdBy: string,
    @Body() dto: CreateUserDTO,
  ): Promise<UserDTO> {
    console.log(createdBy);
    return this.service.create(createdBy, dto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.delete(id);
  }

  @Put(':id')
  @Auth()
  public async update(
    @Param('id') id: string,
    @User('id') updatedBy: string,
    @Body() updateData: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.service.update(updatedBy, id, updateData);
  }
}
