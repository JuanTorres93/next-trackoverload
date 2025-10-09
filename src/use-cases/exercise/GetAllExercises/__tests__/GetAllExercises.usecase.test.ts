import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllExercisesUsecase } from '../GetAllExercises.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import * as vp from '@/../tests/createProps';

describe('GetAllExercisesUsecase', () => {
  let exercisesRepo: MemoryExercisesRepo;
  let getAllExercisesUsecase: GetAllExercisesUsecase;

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    getAllExercisesUsecase = new GetAllExercisesUsecase(exercisesRepo);
  });

  it('should return all exercises', async () => {
    const exercise1 = Exercise.create({
      ...vp.validExerciseProps,
      id: '1',
      name: 'Push Up',
    });
    const exercise2 = Exercise.create({
      ...vp.validExerciseProps,
      id: '2',
      name: 'Squat',
    });

    await exercisesRepo.saveExercise(exercise1);
    await exercisesRepo.saveExercise(exercise2);

    const exercises = await getAllExercisesUsecase.execute();

    expect(exercises).toHaveLength(2);
    expect(exercises).toContain(exercise1);
    expect(exercises).toContain(exercise2);
  });

  it('should return empty array when no exercises exist', async () => {
    const exercises = await getAllExercisesUsecase.execute();

    expect(exercises).toHaveLength(0);
  });
});
