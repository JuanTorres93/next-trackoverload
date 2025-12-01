import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type AddExerciseToWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  sets: number;
};

export class AddExerciseToWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private exercisesRepo: ExercisesRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: AddExerciseToWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddExerciseToWorkoutTemplateUsecase: User with id ${request.userId} not found`
      );
    }

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'AddExerciseToWorkoutTemplateUsecase: WorkoutTemplate not found'
      );
    }

    const exercise = await this.exercisesRepo.getExerciseById(
      request.exerciseId
    );
    if (!exercise) {
      throw new NotFoundError(
        'AddExerciseToWorkoutTemplateUsecase: Exercise not found'
      );
    }

    const workoutTemplateLine = WorkoutTemplateLine.create({
      id: uuidv4(),
      exerciseId: request.exerciseId,
      sets: request.sets,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // NOTE: duplicate exercise handled in entity
    workoutTemplate.addExercise(workoutTemplateLine);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
