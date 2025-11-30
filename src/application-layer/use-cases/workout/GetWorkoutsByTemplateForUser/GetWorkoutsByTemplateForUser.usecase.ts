import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type GetWorkoutsByTemplateForUserUsecaseRequest = {
  templateId: string;
  userId: string;
};

export class GetWorkoutsByTemplateForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(
    request: GetWorkoutsByTemplateForUserUsecaseRequest
  ): Promise<WorkoutDTO[]> {
    const workouts = await this.workoutsRepo.getWorkoutsByTemplateIdAndUserId(
      request.templateId,
      request.userId
    );
    return workouts.map(toWorkoutDTO);
  }
}
