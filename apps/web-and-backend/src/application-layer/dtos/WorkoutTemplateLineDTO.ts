import { WorkoutTemplateLineDTO } from "shared";

import { WorkoutTemplateLine } from "../../domain/entities/workouttemplateline/WorkoutTemplateLine";

export function toWorkoutTemplateLineDTO(
  workoutTemplateLine: WorkoutTemplateLine,
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
