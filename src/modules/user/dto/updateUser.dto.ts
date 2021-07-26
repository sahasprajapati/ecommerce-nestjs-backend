import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './createUser.dto';
export class updateUserDTO extends PartialType(CreateUserDTO) {}
