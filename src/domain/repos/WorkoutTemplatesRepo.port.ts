import { WorkoutTemplate } from '../entities/workouttemplate/WorkoutTemplate';

export interface WorkoutTemplatesRepo {
  getAllWorkoutTemplates(): Promise<WorkoutTemplate[]>;
  getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null>;
  saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void>;
  // NOTE: Deletion for templates is soft to be able to keep history of created workouts.
  // It is implemented directly as a use case to call the markAsDeleted method on the entity and save it. This allows for fewer false positives in tests when implementing real repos.
}
