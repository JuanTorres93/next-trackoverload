import { WorkoutLineDTO } from "./WorkoutLineDTO";

export type WorkoutDTO = {
  id: string;
  userId: string;
  workoutTemplateId: string;

  name: string;
  exercises: WorkoutLineDTO[];

  createdAt: string;
  updatedAt: string;
};
