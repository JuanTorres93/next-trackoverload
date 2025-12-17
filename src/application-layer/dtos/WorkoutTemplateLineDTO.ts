import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';

export type WorkoutTemplateLineDTO = {
  id: string;
  templateId: string;
  exerciseId: string;
  sets: number;
  createdAt: string;
  updatedAt: string;
};

export function toWorkoutTemplateLineDTO(
  workoutTemplateLine: WorkoutTemplateLine
): WorkoutTemplateLineDTO {
  return {
    id: workoutTemplateLine.id,
    templateId: workoutTemplateLine.templateId,
    exerciseId: workoutTemplateLine.exerciseId,
    sets: workoutTemplateLine.sets,
    createdAt: workoutTemplateLine.createdAt.toISOString(),
    updatedAt: workoutTemplateLine.updatedAt.toISOString(),
  };
}
