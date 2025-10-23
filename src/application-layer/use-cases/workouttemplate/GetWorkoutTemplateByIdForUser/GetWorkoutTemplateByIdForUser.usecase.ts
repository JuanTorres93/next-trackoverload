import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutTemplateByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutTemplateByIdForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetWorkoutTemplateByIdForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO | null> {
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

    return workoutTemplate ? toWorkoutTemplateDTO(workoutTemplate) : null;
  }
}
