import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetWorkoutsByTemplateForUserUsecaseRequest = {
  templateId: string;
  userId: string;
};

export class GetWorkoutsByTemplateForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetWorkoutsByTemplateForUserUsecaseRequest
  ): Promise<WorkoutDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetWorkoutsByTemplateForUserUsecase: User with id ${request.userId} not found`
      );
    }

    const workouts = await this.workoutsRepo.getWorkoutsByTemplateIdAndUserId(
      request.templateId,
      request.userId
    );
    return workouts.map(toWorkoutDTO);
  }
}
