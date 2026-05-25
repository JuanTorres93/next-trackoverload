import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "../../../dtos/WorkoutTemplateDTO";

export type ReorderExerciseInWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  newIndex: number;
};

export class ReorderExerciseInWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: ReorderExerciseInWorkoutTemplateUsecaseRequest,
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
        `ReorderExerciseInWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `ReorderExerciseInWorkoutTemplateUsecase: WorkoutTemplate with id ${request.workoutTemplateId} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    workoutTemplate.reorderExercise(request.exerciseId, request.newIndex);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
