import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "@/application-layer/dtos/WorkoutTemplateDTO";
import { TransactionContext } from "@/application-layer/ports/TransactionContext.port";
import { NotFoundError } from "@/domain/common/errors";
import { WorkoutTemplateLine } from "@/domain/entities/workouttemplateline/WorkoutTemplateLine";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "@/domain/repos/WorkoutTemplatesRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

import { createExercisesAndExternalExercisesNoSaveInRepo } from "../../exercise/common/createExercisesAndExternalExercisesNoSaveInRepo";

export type AddExerciseToWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  externalExerciseId: string;
  source: string;
  name: string;
  sets: number;
};

export class AddExerciseToWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private exercisesRepo: ExercisesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private externalExercisesRefRepo: ExternalExercisesRefRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: AddExerciseToWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    const [user, workoutTemplate] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId,
      ),
    ]);

    if (!user) {
      throw new NotFoundError(
        `AddExerciseToWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );
    }

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        "AddExerciseToWorkoutTemplateUsecase: WorkoutTemplate not found",
      );
    }

    const { createdExercises, createdExternalExercises, allExercises } =
      await createExercisesAndExternalExercisesNoSaveInRepo(
        [
          {
            externalExerciseId: request.externalExerciseId,
            source: request.source,
            name: request.name,
          },
        ],
        this.exercisesRepo,
        this.externalExercisesRefRepo,
        this.idGenerator,
      );

    const exerciseToAdd = allExercises[0];

    const workoutTemplateLine = WorkoutTemplateLine.create({
      id: this.idGenerator.generateId(),
      templateId: workoutTemplate.id,
      exerciseId: exerciseToAdd.id,
      sets: request.sets,
    });

    workoutTemplate.addExercise(workoutTemplateLine);

    await this.transactionContext.run(async () => {
      if (Object.keys(createdExternalExercises).length > 0) {
        const externalExercise = Object.values(createdExternalExercises)[0];
        await this.externalExercisesRefRepo.save(externalExercise);
      }

      if (Object.keys(createdExercises).length > 0) {
        const exercise = Object.values(createdExercises)[0];
        await this.exercisesRepo.saveExercise(exercise);
      }

      await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);
    });

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
