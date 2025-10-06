import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkoutTemplateUsecase } from '../CreateWorkoutTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';

describe('CreateWorkoutTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let usecase: CreateWorkoutTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    usecase = new CreateWorkoutTemplateUsecase(workoutTemplatesRepo);
  });

  it('should create a new workout template with the given name', async () => {
    const request = {
      name: 'Push Day',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('Push Day');
    expect(result.exercises).toEqual([]);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should save the workout template in the repository', async () => {
    const request = {
      name: 'Pull Day',
    };

    const result = await usecase.execute(request);

    const savedTemplate = await workoutTemplatesRepo.getWorkoutTemplateById(
      result.id
    );
    expect(savedTemplate).not.toBeNull();
    expect(savedTemplate!.name).toBe('Pull Day');
  });

  it('should throw error if name is invalid', async () => {
    const invalidNames = ['', '   ', null, undefined, 8, {}, [], true, false];

    for (const name of invalidNames) {
      const request = { name };
      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrowError();
    }
  });
});
