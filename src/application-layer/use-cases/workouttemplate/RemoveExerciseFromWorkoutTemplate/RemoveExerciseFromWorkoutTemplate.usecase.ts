import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type RemoveExerciseFromWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
};

export class RemoveExerciseFromWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: RemoveExerciseFromWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveExerciseFromWorkoutTemplateUsecase: User with id ${request.userId} not found`
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
        ' RemoveExerciseFromWorkoutTemplateUsecase: WorkoutTemplate not found'
      );
    }

    workoutTemplate.removeExercise(request.exerciseId);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
