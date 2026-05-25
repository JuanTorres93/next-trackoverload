import { logNoTest } from "@/utils/logNoTest";

import {
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutsRepo } from "../../../../domain/repos/WorkoutsRepo.port";
import { WorkoutDTO, toWorkoutDTO } from "../../../dtos/WorkoutDTO";

export type GetAllWorkoutsForUserRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetAllWorkoutsForUserUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: GetAllWorkoutsForUserRequest): Promise<WorkoutDTO[]> {
    if (request.actorUserId !== request.targetUserId) {
      logNoTest(
        `GetAllWorkoutsForUserUsecase: cannot get workouts for another user`,
      );

      throw new PermissionError(
        "No puedes ver los entrenamientos de otro usuario.",
      );
    }

    const [user, workouts] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.workoutsRepo.getAllWorkoutsByUserId(request.targetUserId),
    ]);

    if (!user) {
      logNoTest(
        `GetAllWorkoutsForUserUsecase: User with id ${request.targetUserId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return workouts.map(toWorkoutDTO);
  }
}
