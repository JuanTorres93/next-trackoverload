import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutTemplateByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutTemplateByIdForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetWorkoutTemplateByIdForUserUsecaseRequest
  ): Promise<WorkoutTemplate | null> {
    validateNonEmptyString(
      request.id,
      'GetWorkoutTemplateByIdForUserUsecase id'
    );
    validateNonEmptyString(
      request.userId,
      'GetWorkoutTemplateByIdForUserUsecase userId'
    );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    return workoutTemplate || null;
  }
}
