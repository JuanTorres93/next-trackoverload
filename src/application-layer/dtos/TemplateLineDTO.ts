import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

export type TemplateLineDTO = {
  id: string;
  exerciseId: string;
  sets: number;
  createdAt: Date;
  updatedAt: Date;
};

export function toTemplateLineDTO(
  templateLine: WorkoutTemplateLine
): TemplateLineDTO {
  return {
    id: templateLine.id,
    exerciseId: templateLine.exerciseId,
    sets: templateLine.sets,
    createdAt: templateLine.createdAt,
    updatedAt: templateLine.updatedAt,
  };
}
