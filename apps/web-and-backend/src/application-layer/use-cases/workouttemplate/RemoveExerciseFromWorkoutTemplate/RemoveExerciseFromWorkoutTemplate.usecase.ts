import { WorkoutTemplateDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import { toWorkoutTemplateDTO } from "../../../dtos/WorkoutTemplateDTO";

export type RemoveExerciseFromWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
};

export class RemoveExerciseFromWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: RemoveExerciseFromWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `RemoveExerciseFromWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `RemoveExerciseFromWorkoutTemplateUsecase: WorkoutTemplate with id ${request.workoutTemplateId} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    workoutTemplate.removeExercise(request.exerciseId);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
