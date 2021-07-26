import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../auth/enum/role.enum';
import { Category } from '../category/category.entity';
import { Product } from '../products/entities/product.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 300,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 300,
  })
  password: string;

  @Column('enum', { enum: ['admin', 'user'], array: true, default: ['user'] })
  roles: Role[];

  @OneToMany((type) => User, (user) => user.assigned.createdBy)
  users_created: User;

  @OneToMany((type) => User, (user) => user.assigned.updatedBy)
  users_updated: User;

  @OneToMany((type) => Product, (product) => product.assigned.createdBy)
  products_created: Product;

  @OneToMany((type) => Product, (product) => product.assigned.updatedBy)
  products_updated: Product;

  @OneToMany((type) => Category, (category) => category.assigned.createdBy)
  category_created: Category;

  @OneToMany((type) => Category, (category) => category.assigned.updatedBy)
  category_updated: Category;
}
