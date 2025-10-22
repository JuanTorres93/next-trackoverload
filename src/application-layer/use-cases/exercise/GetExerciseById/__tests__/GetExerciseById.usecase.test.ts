import { beforeEach, describe, expect, it } from 'vitest';
import { GetExerciseByIdUsecase } from '../GetExerciseById.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('GetExerciseByIdUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getExerciseByIdUsecase: GetExerciseByIdUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getExerciseByIdUsecase = new GetExerciseByIdUsecase(exercisesRepo);
  });

  it('should return exercise when found', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: '1',
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    const result = await getExerciseByIdUsecase.execute({ id: '1' });

    // @ts-expect-error result is not null here
    expect(result.id).toEqual(exercise.id);
  });

  it('should return an array of ExerciseDTO', async () => {
    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      id: '1',
      name: 'Push Up',
    });

    await exercisesRepo.saveExercise(exercise);

    const result = await getExerciseByIdUsecase.execute({ id: '1' });

    expect(result).not.toBeInstanceOf(Exercise);
    expect(result).toHaveProperty('id', exercise.id);
    expect(result).toHaveProperty('name', exercise.name);
    expect(result).toHaveProperty(
      'createdAt',
      exercise.createdAt.toISOString()
    );
    expect(result).toHaveProperty(
      'updatedAt',
      exercise.updatedAt.toISOString()
    );
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
