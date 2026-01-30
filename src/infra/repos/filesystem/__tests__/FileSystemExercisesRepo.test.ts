import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemExercisesRepo } from '../FileSystemExercisesRepo';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import * as vp from '@/../tests/createProps';
import * as exerciseTestProps from '../../../../../tests/createProps/exerciseTestProps';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemExercisesRepo', () => {
  let repo: FileSystemExercisesRepo;
  let exercise: Exercise;
  const testDir = './__test_data__/exercises';

  beforeEach(async () => {
    repo = new FileSystemExercisesRepo(testDir);
    exercise = Exercise.create(exerciseTestProps.validExerciseProps);
    await repo.saveExercise(exercise);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
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

    const savedExercise = allExercises.find((e) => e.id === '2');
    expect(savedExercise).toBeDefined();
    expect(savedExercise?.name).toBe('Squat');
  });

  it('should retrieve an exercise by ID', async () => {
    const fetchedExercise = await repo.getExerciseById(
      exerciseTestProps.validExerciseProps.id,
    );
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe(
      exerciseTestProps.validExerciseProps.name,
    );
  });

  it('should update an existing exercise', async () => {
    const updatedExercise = Exercise.create({
      ...exerciseTestProps.validExerciseProps,
      name: 'Updated Push Up',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveExercise(updatedExercise);

    const fetchedExercise = await repo.getExerciseById(
      exerciseTestProps.validExerciseProps.id,
    );
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe('Updated Push Up');

    // Verify only one file exists
    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);
  });

  it('should return null for non-existent exercise ID', async () => {
    const fetchedExercise = await repo.getExerciseById('non-existent-id');
    expect(fetchedExercise).toBeNull();
  });

  it('should delete an exercise by ID', async () => {
    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);

    await repo.deleteExercise(exerciseTestProps.validExerciseProps.id);

    const allExercisesAfterDeletion = await repo.getAllExercises();
    expect(allExercisesAfterDeletion.length).toBe(0);
  });

  it('should persist data to filesystem', async () => {
    // Verify file exists
    const filePath = path.join(testDir, `${exercise.id}.json`);
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);

    // Verify file content
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.id).toBe(exercise.id);
    expect(data.name).toBe(exercise.name);
  });

  it('should handle empty directory', async () => {
    // Delete all exercises
    await repo.deleteExercise(exercise.id);

    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(0);
  });
});
