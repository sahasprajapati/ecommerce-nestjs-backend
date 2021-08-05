import { CreateImages } from 'src/modules/image/dto/createImage.dto';

export class CreateProductDto {
  name: string;
  price: number;
  isActive: boolean;
  description: string;
  images: CreateImages[];
}
