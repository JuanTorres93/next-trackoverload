import { WorkoutTemplateDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import {
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import { toWorkoutTemplateDTO } from "../../../dtos/WorkoutTemplateDTO";

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
      logNoTest(
        `GetAllWorkoutTemplatesForUserUsecase: cannot get workout templates for another user`,
      );

      throw new PermissionError(
        "No puedes ver las plantillas de otro usuario.",
      );
    }

    const [user, workoutTemplates] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.workoutTemplatesRepo.getAllWorkoutTemplatesByUserId(
        request.targetUserId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `GetAllWorkoutTemplatesForUserUsecase: User with id ${request.targetUserId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return workoutTemplates.map(toWorkoutTemplateDTO) || [];
  }
}
