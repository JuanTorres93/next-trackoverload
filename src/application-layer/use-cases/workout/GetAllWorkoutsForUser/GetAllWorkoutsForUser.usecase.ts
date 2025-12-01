import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllWorkoutsForUserRequest = { userId: string };

export class GetAllWorkoutsForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<WorkoutDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllWorkoutsForUserUsecase: User with id ${request.userId} not found`
      );
    }

    const workouts = await this.workoutsRepo.getAllWorkoutsByUserId(
      request.userId
    );

    return workouts.map(toWorkoutDTO);
  }
}
