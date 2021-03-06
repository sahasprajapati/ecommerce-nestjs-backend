import { Dated } from '../entity/composition';

export abstract class BaseDto {
  id: string;

  isActive: boolean;

  isArchived: boolean;

  dated: Dated;

  internalComment: string | null;
}
