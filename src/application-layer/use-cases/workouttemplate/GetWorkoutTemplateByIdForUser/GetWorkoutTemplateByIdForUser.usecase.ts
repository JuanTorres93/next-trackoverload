import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type GetWorkoutTemplateByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutTemplateByIdForUserUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetWorkoutTemplateByIdForUserUsecaseRequest
  ): Promise<WorkoutTemplateDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetWorkoutTemplateByIdForUserUsecase: User with id ${request.userId} not found`
      );
    }

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    return workoutTemplate ? toWorkoutTemplateDTO(workoutTemplate) : null;
  }
}
