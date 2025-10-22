import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type DeleteWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(request: DeleteWorkoutTemplateUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteWorkoutTemplate id');
    validateNonEmptyString(request.userId, 'DeleteWorkoutTemplate userId');

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
