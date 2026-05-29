import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "../../../dtos/WorkoutTemplateDTO";

export type UpdateExerciseInWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  sets: number;
};

export class UpdateExerciseInWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: UpdateExerciseInWorkoutTemplateUsecaseRequest,
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
        `UpdateExerciseInWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `UpdateExerciseInWorkoutTemplateUsecase: WorkoutTemplate with id ${request.workoutTemplateId} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    workoutTemplate.updateExercise(request.exerciseId, {
      sets: request.sets,
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
