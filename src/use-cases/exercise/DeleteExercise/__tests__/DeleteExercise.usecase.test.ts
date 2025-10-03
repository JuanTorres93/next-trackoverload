import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteExerciseUsecase } from '../DeleteExercise.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { NotFoundError } from '@/domain/common/errors';

describe('DeleteExerciseUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let deleteExerciseUsecase: DeleteExerciseUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    deleteExerciseUsecase = new DeleteExerciseUsecase(exercisesRepo);
  });

  it('should delete existing exercise', async () => {
    const exercise = Exercise.create({
      id: '1',
      name: 'Push Up',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await exercisesRepo.saveExercise(exercise);

    await deleteExerciseUsecase.execute({ id: '1' });

    const deletedExercise = await exercisesRepo.getExerciseById('1');
    expect(deletedExercise).toBeNull();
  });

  it('should throw NotFoundError when exercise does not exist', async () => {
    await expect(
      deleteExerciseUsecase.execute({ id: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
  });
});
