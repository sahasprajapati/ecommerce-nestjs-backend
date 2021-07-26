import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'refresh_token' })
export class RefreshToken {
  /**
   * Unique identification
   * */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;
  @Column()
  is_revoked: boolean;
  @Column()
  expires: Date;
}
