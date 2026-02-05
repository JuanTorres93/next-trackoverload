import * as dto from '@/../tests/dtoProperties';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetExercisesByIdsUsecase } from '../GetExercisesByIds.usecase';

describe('GetExercisesByIdsUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getExercisesByIdsUsecase: GetExercisesByIdsUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getExercisesByIdsUsecase = new GetExercisesByIdsUsecase(exercisesRepo);
  });

  describe('Found', () => {
    it('should return exercises that exist', async () => {
      const exercise1 = Exercise.create({
        id: '1',
        name: 'Push Up',
      });
      const exercise2 = Exercise.create({
        id: '2',
        name: 'Squat',
      });

      await exercisesRepo.saveExercise(exercise1);
      await exercisesRepo.saveExercise(exercise2);

      const exercises = await getExercisesByIdsUsecase.execute({
        ids: ['1', '2', 'non-existent'],
      });

      const exerciseIds = exercises.map((e) => e.id);

      expect(exerciseIds).toHaveLength(2);
      expect(exerciseIds).toContain(exercise1.id);
      expect(exerciseIds).toContain(exercise2.id);
    });

    it('should return an array of ExerciseDTO', async () => {
      const exercise1 = Exercise.create({
        id: '1',
        name: 'Push Up',
      });
      const exercise2 = Exercise.create({
        id: '2',
        name: 'Squat',
      });

      await exercisesRepo.saveExercise(exercise1);
      await exercisesRepo.saveExercise(exercise2);

      const exercises = await getExercisesByIdsUsecase.execute({
        ids: ['1', '2', 'non-existent'],
      });

      expect(exercises).toHaveLength(2);

      for (const exercise of exercises) {
        expect(exercise).not.toBeInstanceOf(Exercise);

        for (const prop of dto.exerciseDTOProperties) {
          expect(exercise).toHaveProperty(prop);
        }
      }
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
  });
});
