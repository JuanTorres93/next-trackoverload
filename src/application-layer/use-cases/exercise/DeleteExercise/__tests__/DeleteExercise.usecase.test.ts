import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteExerciseUsecase } from '../DeleteExercise.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let deleteExerciseUsecase: DeleteExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    deleteExerciseUsecase = new DeleteExerciseUsecase(exercisesRepo);
  });

  describe('Deletion', () => {
    it('should delete existing exercise', async () => {
      const exercise = Exercise.create({
        ...vp.validExerciseProps,
      });

      await exercisesRepo.saveExercise(exercise);

      await deleteExerciseUsecase.execute({ id: vp.validExerciseProps.id });

      const deletedExercise = await exercisesRepo.getExerciseById(
        vp.validExerciseProps.id
      );
      expect(deletedExercise).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when exercise does not exist', async () => {
      await expect(
        deleteExerciseUsecase.execute({ id: 'non-existent' })
      ).rejects.toThrow(NotFoundError);

      await expect(
        deleteExerciseUsecase.execute({ id: 'non-existent' })
      ).rejects.toThrow(/DeleteExerciseUsecase.*Exercise.*not/);
    });
  });
});
