import { beforeEach, describe, expect, it } from 'vitest';
import { GetExerciseByIdUsecase } from '../GetExerciseById.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ValidationError } from '@/domain/common/errors';

describe('GetExerciseByIdUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getExerciseByIdUsecase: GetExerciseByIdUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getExerciseByIdUsecase = new GetExerciseByIdUsecase(exercisesRepo);
  });

  it('should return exercise when found', async () => {
    const exercise = Exercise.create({
      id: '1',
      name: 'Push Up',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await exercisesRepo.saveExercise(exercise);

    const result = await getExerciseByIdUsecase.execute({ id: '1' });

    expect(result).toEqual(exercise);
  });

  it('should return null when exercise not found', async () => {
    const result = await getExerciseByIdUsecase.execute({ id: 'non-existent' });

    expect(result).toBeNull();
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getExerciseByIdUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
