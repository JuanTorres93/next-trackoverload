import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateExerciseUsecase } from '../UpdateExercise.usecase';

describe('UpdateExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let updateExerciseUsecase: UpdateExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    updateExerciseUsecase = new UpdateExerciseUsecase(exercisesRepo);
  });

  describe('Updated', () => {
    it('should update exercise name', async () => {
      const exercise = Exercise.create({
        id: '1',
        name: 'Push Up',
      });

      await exercisesRepo.saveExercise(exercise);

      const updatedExercise = await updateExerciseUsecase.execute({
        id: '1',
        name: 'Modified Push Up',
      });

      expect(updatedExercise.name).toBe('Modified Push Up');
      expect(updatedExercise.id).toBe('1');
      expect(updatedExercise.createdAt).toEqual(
        exercise.createdAt.toISOString(),
      );
      expect(updatedExercise.updatedAt).not.toEqual(exercise.updatedAt);
    });

    it('should return an ExerciseDTO', async () => {
      const exercise = Exercise.create({
        id: '1',
        name: 'Push Up',
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

    it('should not update exercise if no changes provided', async () => {
      const exercise = Exercise.create({
        id: '1',
        name: 'Push Up',
      });

      await exercisesRepo.saveExercise(exercise);

      const updatedExercise = await updateExerciseUsecase.execute({
        id: '1',
      });

      expect(updatedExercise.name).toBe(exercise.name);
      expect(updatedExercise.updatedAt).not.toEqual(exercise.updatedAt);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when exercise does not exist', async () => {
      await expect(
        updateExerciseUsecase.execute({
          id: 'non-existent',
          name: 'New Name',
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw error if exercise does not exist', async () => {
      await expect(
        updateExerciseUsecase.execute({ id: 'non-existent', name: 'New Name' }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        updateExerciseUsecase.execute({ id: 'non-existent', name: 'New Name' }),
      ).rejects.toThrow(/UpdateExerciseUsecase.*Exercise.*not found/);
    });
  });
});
