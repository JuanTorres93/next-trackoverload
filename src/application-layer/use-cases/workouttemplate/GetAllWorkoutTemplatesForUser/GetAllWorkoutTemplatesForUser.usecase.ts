import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type GetAllWorkoutTemplatesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllWorkoutTemplatesForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetAllWorkoutTemplatesForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO[]> {
    const workoutTemplates =
      await this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.userId
      );

    return workoutTemplates.map(toWorkoutTemplateDTO) || [];
  }
}
