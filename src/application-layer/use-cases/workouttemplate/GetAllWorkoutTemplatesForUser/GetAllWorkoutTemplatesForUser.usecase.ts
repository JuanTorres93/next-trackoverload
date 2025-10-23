import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllWorkoutTemplatesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllWorkoutTemplatesForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetAllWorkoutTemplatesForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO[]> {
    validateNonEmptyString(
      request.userId,
      'GetAllWorkoutTemplatesForUserUsecase userId'
    );

    const workoutTemplates =
      await this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.userId
      );

    return workoutTemplates.map(toWorkoutTemplateDTO) || [];
  }
}
