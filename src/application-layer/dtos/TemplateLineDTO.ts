import { TemplateLine } from '@/domain/entities/workouttemplate/WorkoutTemplate';

export type TemplateLineDTO = {
  exerciseId: string;
  sets: number;
};

export function toTemplateLineDTO(templateLine: TemplateLine): TemplateLineDTO {
  return {
    exerciseId: templateLine.exerciseId,
    sets: templateLine.sets,
  };
}
