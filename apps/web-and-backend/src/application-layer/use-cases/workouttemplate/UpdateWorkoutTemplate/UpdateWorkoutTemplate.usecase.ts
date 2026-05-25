import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { WorkoutTemplateUpdateProps } from "../../../../domain/entities/workouttemplate/WorkoutTemplate";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "../../../../domain/repos/WorkoutTemplatesRepo.port";
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "../../../dtos/WorkoutTemplateDTO";

export type UpdateWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
  name: string;
};

export class UpdateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: UpdateWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId,
      ),
    ]);

    if (!user) {
      logNoTest(
        `UpdateWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      logNoTest(
        `UpdateWorkoutTemplateUsecase: WorkoutTemplate with id ${request.id} not found`,
      );

      throw new NotFoundError("La plantilla de entrenamiento no existe.");
    }

    const patch: WorkoutTemplateUpdateProps = {
      name: request.name,
    };

    workoutTemplate.update(patch);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
