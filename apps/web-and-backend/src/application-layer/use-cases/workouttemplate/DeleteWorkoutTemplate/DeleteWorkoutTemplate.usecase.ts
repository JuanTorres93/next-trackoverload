import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";

export type DeleteWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: DeleteWorkoutTemplateUsecaseRequest): Promise<void> {
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `DeleteWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `DeleteWorkoutTemplateUsecase: WorkoutTemplate with id ${request.id} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    workoutTemplate.markAsDeleted();

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);
  }
}
