import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

export class Dated {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedDateTime: Date;
}
