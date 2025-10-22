import { TemplateLineDTO } from './TemplateLineDTO';

export type WorkoutTemplateDTO = {
  id: string;
  userId: string;
  name: string;
  exercises: TemplateLineDTO[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
