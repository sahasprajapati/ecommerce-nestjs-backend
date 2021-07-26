import { User } from 'src/modules/user/user.entity';
import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne((type) => User, (user) => user.products_created, { lazy: true })
  @JoinColumn()
  createdBy: User;

  @ManyToOne((type) => User, (user) => user.products_created, { lazy: true })
  @JoinColumn()
  updatedBy: User;
}
