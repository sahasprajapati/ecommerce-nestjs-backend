import { User } from 'src/modules/user/user.entity';
import { Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';

export class Name {
  @Column({
    name: 'first_name',
    type: 'string',
  })
  firstName: string;
  @Column({
    name: 'last_name',
    type: 'string',
  })
  lastName: string;
}
export class Assigned {
  @ManyToOne((type) => User, (user) => user.users_created, { lazy: true })
  createdBy: User;

  @ManyToOne((type) => User, (user) => user.users_updated, { lazy: true })
  updatedBy: User;
}

export class Dated {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedDateTime: Date;
}
