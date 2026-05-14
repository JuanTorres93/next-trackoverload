import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "@/application-layer/dtos/WorkoutTemplateDTO";
import { TransactionContext } from "@/application-layer/ports/TransactionContext.port";
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from "@/domain/common/errors";
import { WorkoutTemplate } from "@/domain/entities/workouttemplate/WorkoutTemplate";
import { WorkoutTemplateLine } from "@/domain/entities/workouttemplateline/WorkoutTemplateLine";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "@/domain/repos/WorkoutTemplatesRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

import {
  CreateWorkoutTemplateLineData,
  createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo,
} from "../common/createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo";

export type CreateWorkoutTemplateUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  name: string;
  templateLines: CreateWorkoutTemplateLineData[];
};

export class CreateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private exercisesRepo: ExercisesRepo,
    private externalExercisesRefRepo: ExternalExercisesRefRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: CreateWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        "CreateWorkoutTemplateUsecase: cannot create workout template for another user",
      );
    }

    if (!request.templateLines || request.templateLines.length === 0) {
      throw new ValidationError(
        "CreateWorkoutTemplateUsecase: at least one exercise must be included in the workout template",
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(
        `CreateWorkoutTemplateUsecase: User with id ${request.targetUserId} not found`,
      );
    }

    const { setsMapByExternalId, createdExercises, createdExternalExercises } =
      await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
        request.templateLines,
        this.exercisesRepo,
        this.externalExercisesRefRepo,
        this.idGenerator,
      );

    const newTemplateId = this.idGenerator.generateId();

    const newWorkoutTemplate = WorkoutTemplate.create({
      id: newTemplateId,
      userId: request.targetUserId,
      name: request.name,
      exercises: [],
    });

    for (const line of request.templateLines) {
      const { exerciseId, sets } = setsMapByExternalId[line.externalExerciseId];
      newWorkoutTemplate.addExercise(
        WorkoutTemplateLine.create({
          id: this.idGenerator.generateId(),
          templateId: newTemplateId,
          exerciseId,
          sets,
        }),
      );
    }

    await this.transactionContext.run(async () => {
      for (const externalRef of Object.values(createdExternalExercises)) {
        await this.externalExercisesRefRepo.save(externalRef);
      }

      for (const exercise of Object.values(createdExercises)) {
        await this.exercisesRepo.saveExercise(exercise);
      }

      await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);
    });

    return toWorkoutTemplateDTO(newWorkoutTemplate);
  }
}
