import { WorkoutTemplateDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import { toWorkoutTemplateDTO } from "../../../dtos/WorkoutTemplateDTO";

export type GetWorkoutTemplateByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetWorkoutTemplateByIdForUserUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetWorkoutTemplateByIdForUserUsecaseRequest,
  ): Promise<WorkoutTemplateDTO | null> {
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `GetWorkoutTemplateByIdForUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return workoutTemplate ? toWorkoutTemplateDTO(workoutTemplate) : null;
  }
}
