import { beforeEach, describe, expect, it } from 'vitest';
import { GetExercisesByIdsUsecase } from '../GetExercisesByIds.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ValidationError } from '@/domain/common/errors';

describe('GetExercisesByIdsUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getExercisesByIdsUsecase: GetExercisesByIdsUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getExercisesByIdsUsecase = new GetExercisesByIdsUsecase(exercisesRepo);
  });

  it('should return exercises that exist', async () => {
    const exercise1 = Exercise.create({
      id: '1',
      name: 'Push Up',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const exercise2 = Exercise.create({
      id: '2',
      name: 'Squat',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await exercisesRepo.saveExercise(exercise1);
    await exercisesRepo.saveExercise(exercise2);

    const exercises = await getExercisesByIdsUsecase.execute({
      ids: ['1', '2', 'non-existent'],
    });

    expect(exercises).toHaveLength(2);
    expect(exercises).toContain(exercise1);
    expect(exercises).toContain(exercise2);
  });

  it('should return empty array when no exercises found', async () => {
    const exercises = await getExercisesByIdsUsecase.execute({
      ids: ['non-existent-1', 'non-existent-2'],
    });

    expect(exercises).toHaveLength(0);
  });

  it('should return empty array when ids array is empty', async () => {
    const exercises = await getExercisesByIdsUsecase.execute({
      ids: [],
    });

    expect(exercises).toHaveLength(0);
  });

  it('should throw error when ids are invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getExercisesByIdsUsecase.execute({ ids: [invalidId] })
      ).rejects.toThrow(ValidationError);
    }
  });
});
