import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryExercisesRepo } from '../MemoryExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';

const validExerciseProps = {
  id: '1',
  name: 'Push Up',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryExercisesRepo', () => {
  let repo: MemoryExercisesRepo;
  let exercise: Exercise;

  beforeEach(async () => {
    repo = new MemoryExercisesRepo();
    exercise = Exercise.create(validExerciseProps);

    await repo.saveExercise(exercise);
  });

  it('should save an exercise', async () => {
    const newExercise = Exercise.create({
      id: '2',
      name: 'Squat',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveExercise(newExercise);

    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(2);
    expect(allExercises[1].name).toBe('Squat');
  });

  it('should retrieve an exercise by ID', async () => {
    const fetchedExercise = await repo.getExerciseById(validExerciseProps.id);
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe(validExerciseProps.name);
  });

  it('should update an existing exercise', async () => {
    const updatedExercise = Exercise.create({
      ...validExerciseProps,
      name: 'Updated Push Up',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveExercise(updatedExercise);

    const fetchedExercise = await repo.getExerciseById(validExerciseProps.id);
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe('Updated Push Up');
  });

  it('should return null for non-existent exercise ID', async () => {
    const fetchedExercise = await repo.getExerciseById('non-existent-id');
    expect(fetchedExercise).toBeNull();
  });

  it('should delete an exercise by ID', async () => {
    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);

    await repo.deleteExercise(validExerciseProps.id);

    const allExercisesAfterDeletion = await repo.getAllExercises();
    expect(allExercisesAfterDeletion.length).toBe(0);
  });
});
