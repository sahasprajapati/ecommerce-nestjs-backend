import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  /**
   * Name of category
   * @example 'book'
   * */
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @ManyToOne((type) => User, (user) => user.category_created, { lazy: true })
  @JoinColumn()
  createdBy: User;

  @ManyToOne((type) => User, (user) => user.category_updated, { lazy: true })
  @JoinColumn()
  updatedBy: User;
}
