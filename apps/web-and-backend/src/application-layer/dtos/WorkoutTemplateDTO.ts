import { WorkoutTemplateDTO } from "shared";

import { WorkoutTemplate } from "../../domain/entities/workouttemplate/WorkoutTemplate";
import { toWorkoutTemplateLineDTO } from "./WorkoutTemplateLineDTO";

export function toWorkoutTemplateDTO(
  workoutTemplate: WorkoutTemplate,
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
