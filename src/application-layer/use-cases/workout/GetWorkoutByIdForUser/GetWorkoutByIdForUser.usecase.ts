import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetWorkoutByIdForUseUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutByIdForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetWorkoutByIdForUseUsecaseRequest
  ): Promise<WorkoutDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetWorkoutByIdForUserUsecase: User with id ${request.userId} not found`
      );
    }

    const workout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    return workout ? toWorkoutDTO(workout) : null;
  }
}
