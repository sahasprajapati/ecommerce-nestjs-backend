import { BaseDto } from 'src/utility/dto/base.dto';

export class UserDTO extends BaseDto {
  id: string;
  name: string;
  price: string;
}
