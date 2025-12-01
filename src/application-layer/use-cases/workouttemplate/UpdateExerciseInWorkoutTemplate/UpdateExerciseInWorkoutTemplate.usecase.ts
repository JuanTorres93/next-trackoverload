import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type UpdateExerciseInWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  sets: number;
};

export class UpdateExerciseInWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: UpdateExerciseInWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `UpdateExerciseInWorkoutTemplateUsecase: User with id ${request.userId} not found`
      );
    }

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'UpdateExerciseInWorkoutTemplate WorkoutTemplate not found'
      );
    }

    // NOTE: sets is validated in the entity
    workoutTemplate.updateExercise(request.exerciseId, {
      sets: request.sets,
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
