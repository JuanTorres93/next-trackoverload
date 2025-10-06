import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutTemplateByIdUsecase } from '../GetWorkoutTemplateById.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';

describe('GetWorkoutTemplateByIdUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: GetWorkoutTemplateByIdUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new GetWorkoutTemplateByIdUsecase(workoutTemplatesRepo);
  });

  it('should return the workout template when it exists', async () => {
    const template = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const result = await usecase.execute({ id: '1' });

    expect(result.id).toBe('1');
    expect(result.name).toBe('Push Day');
  });

  it('should throw NotFoundError when workout template does not exist', async () => {
    await expect(usecase.execute({ id: 'non-existent' })).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw error if id is invalid', async () => {
    const invalidIds = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const id of invalidIds) {
      const request = { id };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });

  it('should throw NotFoundError when trying to get deleted workout template', async () => {
    const template = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    template.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    await expect(usecase.execute({ id: '1' })).rejects.toThrow(NotFoundError);
  });
});
