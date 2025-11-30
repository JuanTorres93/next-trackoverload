import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';

export type GetAllWorkoutsForUserRequest = { userId: string };

export class GetAllWorkoutsForUserUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<WorkoutDTO[]> {
    const workouts = await this.workoutsRepo.getAllWorkoutsByUserId(
      request.userId
    );

    return workouts.map(toWorkoutDTO);
  }
}
