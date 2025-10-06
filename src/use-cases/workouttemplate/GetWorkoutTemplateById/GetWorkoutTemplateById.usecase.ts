import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetWorkoutTemplateByIdUsecaseRequest = {
  id: string;
};

export class GetWorkoutTemplateByIdUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: GetWorkoutTemplateByIdUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(request.id, 'GetWorkoutTemplateById id');

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(request.id);

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    return workoutTemplate;
  }
}
