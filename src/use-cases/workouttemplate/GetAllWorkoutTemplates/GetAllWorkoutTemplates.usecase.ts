import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';

export class GetAllWorkoutTemplatesUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(): Promise<WorkoutTemplate[]> {
    const workoutTemplates =
      await this.workoutTemplatesRepo.getAllWorkoutTemplates();

    return workoutTemplates || [];
  }
}
