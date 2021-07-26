import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { DeleteResult, UpdateResult } from 'typeorm';
import { RegisterRequest } from './../auth/requests';
import { CreateUserDTO } from './dto/createUser.dto';
import { updateUserDTO } from './dto/updateUser.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  public async getAll() {
    return await this.users.find();
  }

  public async create(
    createdBy: string,
    dto: CreateUserDTO,
    // , user: User
  ): Promise<UserDTO> {
    const user = new User();
    user.name = dto.name;
    user.password = dto.password;
    const creator = await this.users.findForId(createdBy);

    console.log(creator);
    user.assigned = {
      createdBy: creator,
      updatedBy: creator,
    };
    return await this.users.save(user);
  }
  public async update(
    updatedBy: string,
    id: string,
    dto: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.users.update(id, {
      assigned: {
        updatedBy: await this.findForId(updatedBy),
      },
      ...dto,
    });
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.users.delete(id);
  }

  public async validateCredentials(
    user: User,
    password: string,
  ): Promise<boolean> {
    return compare(password, user.password);
  }

  public async createUserFromRequest(request: RegisterRequest): Promise<User> {
    const { username, password } = request;

    const existingFromUsername = await this.findForUsername(username);

    if (existingFromUsername) {
      throw new UnprocessableEntityException('Username already in use');
    }

    return this.users.signup(username, password);
  }

  public async findForId(id: string): Promise<User | null> {
    return this.users.findForId(id);
  }

  public async findForUsername(username: string): Promise<User | null> {
    return this.users.findForUsername(username);
  }

  // .then((e) => e.map((user) => UserDTO.fromEntity(user)));
}
