import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Assigned, Dated } from './composition';

export abstract class BaseEntity {
  /**
   * Unique identification
   * */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column((type) => Assigned)
  assigned: Assigned;

  @Column((type) => Dated)
  dated: Dated;

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment: string | null;
}
