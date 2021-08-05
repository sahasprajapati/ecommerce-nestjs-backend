import { UpdateImages } from 'src/modules/image/dto/updateImage.dto';

export class UpdateProductDto {
  name: string;
  price: number;
  isActive: boolean;
  description: string;

  images: UpdateImages[];
}
