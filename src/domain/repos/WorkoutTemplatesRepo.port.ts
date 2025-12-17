import { WorkoutTemplate } from '../entities/workouttemplate/WorkoutTemplate';

export interface WorkoutTemplatesRepo {
  getAllWorkoutTemplates(): Promise<WorkoutTemplate[]>;
  getAllWorkoutTemplatesByUserId(userId: string): Promise<WorkoutTemplate[]>;
  getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null>;
  getWorkoutTemplateByIdAndUserId(
    id: string,
    userId: string
  ): Promise<WorkoutTemplate | null>;
  saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void>;
  // NOTE: Regular deletion for templates is soft to be able to keep history of created workouts.
  // It is implemented directly as a use case to call the markAsDeleted method on the entity and save it. This allows for fewer false positives in tests when implementing real repos.
  // NOTE: However, for user deletion, we want to hard delete all associated templates, since there will be no need to keep history.
  deleteAllWorkoutTemplatesForUser(userId: string): Promise<void>;
}
