import { BaseDto } from 'src/utility/dto/base.dto';

export class UserDTO extends BaseDto {
  name: string;
  password: string;
}
