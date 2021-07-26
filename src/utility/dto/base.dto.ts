import { Assigned, Dated } from '../entity/composition';

export abstract class BaseDto {
  id: string;

  isActive: boolean;

  isArchived: boolean;

  assigned: Assigned;

  dated: Dated;

  internalComment: string | null;
}
