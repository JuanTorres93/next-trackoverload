import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { TemplateLineDTO, toTemplateLineDTO } from './TemplateLineDTO';

export type WorkoutTemplateDTO = {
  id: string;
  userId: string;
  name: string;
  exercises: TemplateLineDTO[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export function toWorkoutTemplateDTO(
  workoutTemplate: WorkoutTemplate
): WorkoutTemplateDTO {
  return {
    id: workoutTemplate.id,
    userId: workoutTemplate.userId,
    name: workoutTemplate.name,
    exercises: workoutTemplate.exercises.map(toTemplateLineDTO),
    createdAt: workoutTemplate.createdAt.toISOString(),
    updatedAt: workoutTemplate.updatedAt.toISOString(),
    deletedAt: workoutTemplate.deletedAt?.toISOString(),
  };
}
