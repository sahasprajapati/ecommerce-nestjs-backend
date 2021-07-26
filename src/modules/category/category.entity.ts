import { BaseEntity } from 'src/utility/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
}
