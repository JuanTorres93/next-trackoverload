import { NotFoundError } from '@/domain/common/errors';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type DeleteWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(request: DeleteWorkoutTemplateUsecaseRequest): Promise<void> {
    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    workoutTemplate.markAsDeleted();

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);
  }
}
