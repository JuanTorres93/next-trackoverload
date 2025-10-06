import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type DeleteWorkoutTemplateUsecaseRequest = {
  id: string;
};

export class DeleteWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(request: DeleteWorkoutTemplateUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteWorkoutTemplate id');

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(request.id);

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    workoutTemplate.markAsDeleted();

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);
  }
}
