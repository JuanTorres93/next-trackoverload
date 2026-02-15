import * as exerciseTestProps from '../../../../../../tests/createProps/exerciseTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetExerciseByIdUsecase } from '../GetExerciseById.usecase';

describe('GetExerciseByIdUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getExerciseByIdUsecase: GetExerciseByIdUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getExerciseByIdUsecase = new GetExerciseByIdUsecase(exercisesRepo);
  });

  describe('Found', () => {
    it('should return exercise when found', async () => {
      const exercise = exerciseTestProps.createTestExercise({
        id: '1',
      });

      await exercisesRepo.saveExercise(exercise);

      const result = await getExerciseByIdUsecase.execute({ id: '1' });

      expect(result!.id).toEqual(exercise.id);
    });

    it('should return an array of ExerciseDTO', async () => {
      const exercise = exerciseTestProps.createTestExercise({
        id: '1',
      });

      await exercisesRepo.saveExercise(exercise);

      const result = await getExerciseByIdUsecase.execute({ id: '1' });

      expect(result).not.toBeInstanceOf(Exercise);
      for (const prop of dto.exerciseDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when exercise not found', async () => {
      const result = await getExerciseByIdUsecase.execute({
        id: 'non-existent',
      });

      expect(result).toBeNull();
    });
  });
});
