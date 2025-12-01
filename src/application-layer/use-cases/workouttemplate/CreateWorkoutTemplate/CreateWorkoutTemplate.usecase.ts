import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type CreateWorkoutTemplateUsecaseRequest = {
  userId: string;
  name: string;
};

export class CreateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: CreateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateWorkoutTemplateUsecase: User with id ${request.userId} not found`
      );
    }

    const newWorkoutTemplate = WorkoutTemplate.create({
      id: uuidv4(),
      userId: request.userId,
      name: request.name,
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);

    return toWorkoutTemplateDTO(newWorkoutTemplate);
  }
}
