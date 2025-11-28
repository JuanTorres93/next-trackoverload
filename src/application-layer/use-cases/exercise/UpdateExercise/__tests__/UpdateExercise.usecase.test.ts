import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseUsecase } from '../UpdateExercise.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { Id } from '@/domain/value-objects/Id/Id';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let updateExerciseUsecase: UpdateExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    updateExerciseUsecase = new UpdateExerciseUsecase(exercisesRepo);
  });

  it('should update exercise name', async () => {
    const exercise = Exercise.create({
      id: Id.create('1'),
      name: 'Push Up',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await exercisesRepo.saveExercise(exercise);

    const updatedExercise = await updateExerciseUsecase.execute({
      id: '1',
      name: 'Modified Push Up',
    });

    expect(updatedExercise.name).toBe('Modified Push Up');
    expect(updatedExercise.id).toBe('1');
    expect(updatedExercise.createdAt).toEqual(exercise.createdAt.toISOString());
    expect(updatedExercise.updatedAt).not.toEqual(exercise.updatedAt);
  });

  it('should return an array of ExerciseDTO', async () => {
    const exercise = Exercise.create({
      id: Id.create('1'),
      name: 'Push Up',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await exercisesRepo.saveExercise(exercise);

    const updatedExercise = await updateExerciseUsecase.execute({
      id: '1',
      name: 'Modified Push Up',
    });

    expect(updatedExercise).not.toBeInstanceOf(Exercise);

    for (const prop of dto.exerciseDTOProperties) {
      expect(updatedExercise).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when exercise does not exist', async () => {
    await expect(
      updateExerciseUsecase.execute({
        id: 'non-existent',
        name: 'New Name',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should not update exercise if no changes provided', async () => {
    const exercise = Exercise.create({
      id: Id.create('1'),
      name: 'Push Up',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await exercisesRepo.saveExercise(exercise);

    const updatedExercise = await updateExerciseUsecase.execute({
      id: '1',
    });

    expect(updatedExercise.name).toBe(exercise.name);
    expect(updatedExercise.updatedAt).not.toEqual(exercise.updatedAt);
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateExerciseUsecase.execute({ id: invalidId, name: 'New Name' })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when name is invalid', async () => {
    const invalidNames = [true, 4, null];

    for (const invalidName of invalidNames) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateExerciseUsecase.execute({ id: '1', name: invalidName })
      ).rejects.toThrow(ValidationError);
    }
  });
});
