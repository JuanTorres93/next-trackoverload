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

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    const workoutTemplate = this.workoutTemplates.find((wt) => wt.id === id);
    return workoutTemplate || null;
  }

  async deleteWorkoutTemplate(id: string): Promise<void> {
    const index = this.workoutTemplates.findIndex((wt) => wt.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.workoutTemplates.splice(index, 1);
  }
}
