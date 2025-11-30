import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type GetWorkoutTemplateByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutTemplateByIdForUserUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetWorkoutTemplateByIdForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO | null> {
    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    return workoutTemplate ? toWorkoutTemplateDTO(workoutTemplate) : null;
  }
}
