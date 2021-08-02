import { Product } from 'src/modules/products/entities/product.entity';
import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('image')
export class Image extends BaseEntity {
  @Column()
  url: string;
  @Column()
  thumbnailUrl: string;
  @Column()
  name: string;
  @Column()
  fileId: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
