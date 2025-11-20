import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

export class MemoryWorkoutTemplatesRepo implements WorkoutTemplatesRepo {
  private workoutTemplates: WorkoutTemplate[] = [];

  async saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void> {
    const existingIndex = this.workoutTemplates.findIndex(
      (wt) => wt.id === workoutTemplate.id
    );

    if (existingIndex !== -1) {
      this.workoutTemplates[existingIndex] = workoutTemplate;
    } else {
      this.workoutTemplates.push(workoutTemplate);
    }
  }

  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return [...this.workoutTemplates];
  }

  async getAllWorkoutTemplatesByUserId(
    userId: string
  ): Promise<WorkoutTemplate[]> {
    return this.workoutTemplates.filter(
      (wt) => wt.userId === userId && !wt.isDeleted
    );
  }

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    const workoutTemplate = this.workoutTemplates.find(
      (wt) => wt.id === id && !wt.isDeleted
    );

    return workoutTemplate || null;
  }

  async getWorkoutTemplateByIdAndUserId(
    id: string,
    userId: string
  ): Promise<WorkoutTemplate | null> {
    const workoutTemplate = this.workoutTemplates.find(
      (wt) => wt.id === id && wt.userId === userId && !wt.isDeleted
    );

    return workoutTemplate || null;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  // Used sparingly in tests to verify internal state (specifically for soft deletes)
  get workoutTemplatesForTesting(): WorkoutTemplate[] {
    return [...this.workoutTemplates];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.workoutTemplates = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.workoutTemplates.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): WorkoutTemplate[] {
    return [...this.workoutTemplates];
  }
}
