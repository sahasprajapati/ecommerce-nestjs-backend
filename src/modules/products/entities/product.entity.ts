import { Image } from 'src/modules/image/entity/image.entity';
import { User } from 'src/modules/user/user.entity';
import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @ManyToOne((type) => User, (user) => user.products_created, { lazy: true })
  @JoinColumn()
  createdBy: User;

  @ManyToOne((type) => User, (user) => user.products_created, { lazy: true })
  @JoinColumn()
  updatedBy: User;
}
