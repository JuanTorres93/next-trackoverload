import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type GetAllWorkoutTemplatesForUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetAllWorkoutTemplatesForUserUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetAllWorkoutTemplatesForUserUsecaseRequest,
  ): Promise<WorkoutTemplateDTO[]> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        `GetAllWorkoutTemplatesForUserUsecase: cannot get workout templates for another user`,
      );
    }

    const [user, workoutTemplates] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.targetUserId,
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `GetAllWorkoutTemplatesForUserUsecase: User with id ${request.targetUserId} not found`,
      );
    }

    return workoutTemplates.map(toWorkoutTemplateDTO) || [];
  }
}
