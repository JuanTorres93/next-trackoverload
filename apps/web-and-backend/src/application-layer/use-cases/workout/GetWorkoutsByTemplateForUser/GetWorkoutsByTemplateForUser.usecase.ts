import { WorkoutDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { toWorkoutDTO } from "../../../dtos/WorkoutDTO";

export type GetWorkoutsByTemplateForUserUsecaseRequest = {
  templateId: string;
  userId: string;
};

export class GetWorkoutsByTemplateForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetWorkoutsByTemplateForUserUsecaseRequest,
  ): Promise<WorkoutDTO[]> {
    const [user, workouts] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutsByTemplateIdAndUserId(
        request.templateId,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `GetWorkoutsByTemplateForUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return workouts.map(toWorkoutDTO);
  }
}
