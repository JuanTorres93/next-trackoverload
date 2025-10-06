import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutsByTemplateUsecaseRequest = {
  templateId: string;
};

export class GetWorkoutsByTemplateUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutsByTemplateUsecaseRequest
  ): Promise<Workout[]> {
    validateNonEmptyString(
      request.templateId,
      'GetWorkoutsByTemplate templateId'
    );

    const workouts = await this.workoutsRepo.getWorkoutsByTemplateId(
      request.templateId
    );
    return workouts || [];
  }
}
