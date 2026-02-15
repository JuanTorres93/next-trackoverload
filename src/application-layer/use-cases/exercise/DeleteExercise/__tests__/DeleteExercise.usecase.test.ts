import { NotFoundError } from '@/domain/common/errors';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import * as exerciseTestProps from '../../../../../../tests/createProps/exerciseTestProps';
import { DeleteExerciseUsecase } from '../DeleteExercise.usecase';

describe('DeleteExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let deleteExerciseUsecase: DeleteExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    deleteExerciseUsecase = new DeleteExerciseUsecase(exercisesRepo);
  });

  describe('Deletion', () => {
    it('should delete existing exercise', async () => {
      const exercise = exerciseTestProps.createTestExercise();

      await exercisesRepo.saveExercise(exercise);

      await deleteExerciseUsecase.execute({
        id: exercise.id,
      });

      const deletedExercise = await exercisesRepo.getExerciseById(exercise.id);
      expect(deletedExercise).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when exercise does not exist', async () => {
      await expect(
        deleteExerciseUsecase.execute({ id: 'non-existent' }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        deleteExerciseUsecase.execute({ id: 'non-existent' }),
      ).rejects.toThrow(/DeleteExerciseUsecase.*Exercise.*not/);
    });
  });
});
