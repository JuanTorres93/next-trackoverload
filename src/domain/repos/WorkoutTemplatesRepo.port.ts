import { WorkoutTemplate } from '../entities/workouttemplate/WorkoutTemplate';

export interface WorkoutTemplatesRepo {
  getAllWorkoutTemplates(): Promise<WorkoutTemplate[]>;
  getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null>;
  saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void>;
  deleteWorkoutTemplate(id: string): Promise<void>;
}
