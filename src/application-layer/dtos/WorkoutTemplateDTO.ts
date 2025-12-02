import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import {
  WorkoutTemplateLineDTO,
  toWorkoutTemplateLineDTO,
} from './WorkoutTemplateLineDTO';

export type WorkoutTemplateDTO = {
  id: string;
  userId: string;
  name: string;
  exercises: WorkoutTemplateLineDTO[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
};

export function toWorkoutTemplateDTO(
  workoutTemplate: WorkoutTemplate
): WorkoutTemplateDTO {
  return {
    id: workoutTemplate.id,
    userId: workoutTemplate.userId,
    name: workoutTemplate.name,
    exercises: workoutTemplate.exercises.map(toWorkoutTemplateLineDTO),
    createdAt: workoutTemplate.createdAt.toISOString(),
    updatedAt: workoutTemplate.updatedAt.toISOString(),
    deletedAt: workoutTemplate.deletedAt?.toISOString(),
    isDeleted: workoutTemplate.isDeleted,
  };
}
