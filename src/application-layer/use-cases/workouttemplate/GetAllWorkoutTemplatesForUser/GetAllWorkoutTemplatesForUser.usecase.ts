import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type GetAllWorkoutTemplatesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllWorkoutTemplatesForUserUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetAllWorkoutTemplatesForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllWorkoutTemplatesForUserUsecase: User with id ${request.userId} not found`
      );
    }

    const workoutTemplates =
      await this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.userId
      );

    return workoutTemplates.map(toWorkoutTemplateDTO) || [];
  }
}
