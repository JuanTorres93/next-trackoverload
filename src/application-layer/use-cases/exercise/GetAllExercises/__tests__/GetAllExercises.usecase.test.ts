import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllExercisesUsecase } from '../GetAllExercises.usecase';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import * as vp from '@/../tests/createProps';
import { toExerciseDTO } from '@/application-layer/dtos/ExerciseDTO';

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

    const exerciseIds = exercises.map((e) => e.id);

    expect(exercises).toHaveLength(2);
    expect(exerciseIds).toContain(exercise1.id);
    expect(exerciseIds).toContain(exercise2.id);
  });

  it('should return an array of ExerciseDTO', async () => {
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
    expect(exercises).toContainEqual(toExerciseDTO(exercise1));
    expect(exercises).toContainEqual(toExerciseDTO(exercise2));
  });

  it('should return empty array when no exercises exist', async () => {
    const exercises = await getAllExercisesUsecase.execute();

    expect(exercises).toHaveLength(0);
  });
});
