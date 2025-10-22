import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutsByTemplateForUserUsecaseRequest = {
  templateId: string;
  userId: string;
};

export class GetWorkoutsByTemplateForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutsByTemplateForUserUsecaseRequest
  ): Promise<Workout[]> {
    validateNonEmptyString(
      request.templateId,
      'GetWorkoutsByTemplateForUser templateId'
    );
    validateNonEmptyString(
      request.userId,
      'GetWorkoutsByTemplateForUser userId'
    );

    const workouts = await this.workoutsRepo.getWorkoutsByTemplateIdAndUserId(
      request.templateId,
      request.userId
    );
    return workouts || [];
  }
}
