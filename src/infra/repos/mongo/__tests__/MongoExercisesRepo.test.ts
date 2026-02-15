import * as exerciseTestProps from '../../../../../tests/createProps/exerciseTestProps';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MongoExercisesRepo } from '../MongoExercisesRepo';
import {
  setupMongoTestDB,
  teardownMongoTestDB,
  clearMongoTestDB,
} from './setupMongoTestDB';

describe('MongoExercisesRepo', () => {
  let repo: MongoExercisesRepo;
  let exercise: Exercise;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoExercisesRepo();
    exercise = exerciseTestProps.createTestExercise();
    await repo.saveExercise(exercise);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save an exercise', async () => {
    const newExercise = exerciseTestProps.createTestExercise({
      id: 'ex-2',
      name: 'Bench Press',
    });
    await repo.saveExercise(newExercise);

    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(2);
    expect(allExercises[1].name).toBe('Bench Press');
  });

  it('should update an existing exercise', async () => {
    const existingExercise = await repo.getExerciseById(exercise.id);
    existingExercise!.update({
      name: 'Updated Exercise Name',
    });
    await repo.saveExercise(existingExercise!);

    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);
    expect(allExercises[0].name).toBe('Updated Exercise Name');
  });

  it('should retrieve an exercise by ID', async () => {
    const fetchedExercise = await repo.getExerciseById(exercise.id);

    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise!.id).toBe(exercise.id);
    expect(fetchedExercise!.name).toBe(exercise.name);
  });

  it('should return null for non-existent exercise ID', async () => {
    const fetchedExercise = await repo.getExerciseById('non-existent-id');

    expect(fetchedExercise).toBeNull();
  });

  it('should retrieve all exercises', async () => {
    const exercise2 = exerciseTestProps.createTestExercise({
      id: 'ex-2',
      name: 'Squats',
    });
    const exercise3 = exerciseTestProps.createTestExercise({
      id: 'ex-3',
      name: 'Deadlift',
    });

    await repo.saveExercise(exercise2);
    await repo.saveExercise(exercise3);

    const allExercises = await repo.getAllExercises();
    expect(allExercises).toHaveLength(3);
  });

  it('should delete an exercise by ID', async () => {
    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);

    await repo.deleteExercise(exercise.id);

    const allExercisesAfterDeletion = await repo.getAllExercises();
    expect(allExercisesAfterDeletion.length).toBe(0);
  });

  it('should return null when trying to delete a non-existent exercise', async () => {
    await expect(repo.deleteExercise('non-existent-id')).rejects.toEqual(null);
  });
});
