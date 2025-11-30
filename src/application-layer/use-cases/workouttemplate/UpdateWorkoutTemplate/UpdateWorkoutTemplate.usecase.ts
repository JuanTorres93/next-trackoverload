import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutTemplateUpdateProps } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type UpdateWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
  name: string;
};

export class UpdateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: UpdateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    const patch: WorkoutTemplateUpdateProps = {
      name: request.name,
    };

    workoutTemplate.update(patch);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
