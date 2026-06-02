import { WorkoutTemplateLineDTO } from "./WorkoutTemplateLineDTO";

export type WorkoutTemplateDTO = {
  id: string;
  userId: string;

  name: string;
  exercises: WorkoutTemplateLineDTO[];
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
