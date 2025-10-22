import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllWorkoutTemplatesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllWorkoutTemplatesForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetAllWorkoutTemplatesForUserUsecaseRequest
  ): Promise<WorkoutTemplate[]> {
    validateNonEmptyString(
      request.userId,
      'GetAllWorkoutTemplatesForUserUsecase userId'
    );

    const workoutTemplates =
      await this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.userId
      );

    return workoutTemplates || [];
  }
}
