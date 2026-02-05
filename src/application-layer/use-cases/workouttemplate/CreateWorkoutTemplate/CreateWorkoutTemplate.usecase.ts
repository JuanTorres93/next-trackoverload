import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type CreateWorkoutTemplateUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  name: string;
};

export class CreateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: CreateWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        'CreateWorkoutTemplateUsecase: cannot create workout template for another user',
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(
        `CreateWorkoutTemplateUsecase: User with id ${request.targetUserId} not found`,
      );
    }

    const newWorkoutTemplate = WorkoutTemplate.create({
      id: this.idGenerator.generateId(),
      userId: request.targetUserId,
      name: request.name,
      exercises: [],
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);

    return toWorkoutTemplateDTO(newWorkoutTemplate);
  }
}
