import { UpdateImages } from 'src/modules/image/dto/updateImage.dto';

export class UpdateProductDto {
  name: string;
  price: number;
  isActive: boolean;
  images: UpdateImages[];
}
