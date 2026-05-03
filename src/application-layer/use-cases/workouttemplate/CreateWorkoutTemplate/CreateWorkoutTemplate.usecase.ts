import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from "@/application-layer/dtos/WorkoutTemplateDTO";
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from "@/domain/common/errors";
import { WorkoutTemplate } from "@/domain/entities/workouttemplate/WorkoutTemplate";
import {
  WorkoutTemplateLine,
  WorkoutTemplateLineCreateProps,
} from "@/domain/entities/workouttemplateline/WorkoutTemplateLine";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";
import { WorkoutTemplatesRepo } from "@/domain/repos/WorkoutTemplatesRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

export type CreateWorkoutTemplateUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  name: string;
  templateLines: Omit<
    WorkoutTemplateLineCreateProps,
    "id" | "templateId" | "createdAt" | "updatedAt"
  >[];
};

export class CreateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
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

    const newTemplateId = this.idGenerator.generateId();

    const newWorkoutTemplate = WorkoutTemplate.create({
      id: newTemplateId,
      userId: request.targetUserId,
      name: request.name,
      exercises: [],
    });

    const workoutTemplateLines = request.templateLines.map((line) =>
      WorkoutTemplateLine.create({
        id: this.idGenerator.generateId(),
        templateId: newTemplateId,
        exerciseId: line.exerciseId,
        sets: line.sets,
      }),
    );

    for (const line of workoutTemplateLines) {
      newWorkoutTemplate.addExercise(line);
    }

    await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);

    return toWorkoutTemplateDTO(newWorkoutTemplate);
  }
}
