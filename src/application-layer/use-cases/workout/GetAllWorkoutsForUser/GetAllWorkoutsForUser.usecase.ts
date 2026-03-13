import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllWorkoutsForUserRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetAllWorkoutsForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<WorkoutDTO[]> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        `GetAllWorkoutsForUserUsecase: cannot get workouts for another user`,
      );
    }

    const [user, workouts] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.workoutsRepo.getAllWorkoutsByUserId(request.targetUserId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `GetAllWorkoutsForUserUsecase: User with id ${request.targetUserId} not found`,
      );
    }

    return workouts.map(toWorkoutDTO);
  }
}
