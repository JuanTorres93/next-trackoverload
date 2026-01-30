import * as vp from '@/../tests/createProps';
import * as workoutTestProps from '../../../../../tests/createProps/workoutTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { Workout } from '@/domain/entities/workout/Workout';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemWorkoutsRepo } from '../FileSystemWorkoutsRepo';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemWorkoutsRepo', () => {
  let repo: FileSystemWorkoutsRepo;
  let workout: Workout;
  let workoutLine: WorkoutLine;
  const testWorkoutsDir = './__test_data__/workouts';
  const testWorkoutLinesDir = './__test_data__/workoutlines';

  beforeEach(async () => {
    repo = new FileSystemWorkoutsRepo(testWorkoutsDir, testWorkoutLinesDir);
    workout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      name: 'Push Day',
    });

    workoutLine = WorkoutLine.create({
      ...workoutTestProps.validWorkoutLineProps,
    });

    await repo.saveWorkout(workout);
  });

  afterEach(async () => {
    try {
      await fs.rm(testWorkoutsDir, { recursive: true, force: true });
      await fs.rm(testWorkoutLinesDir, { recursive: true, force: true });
    } catch (error) {
      // Directories might not exist
    }
  });

  it('should save a workout', async () => {
    const newWorkout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'another-workout-id',
      name: 'Pull Day',
    });
    await repo.saveWorkout(newWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(2);

    const savedWorkout = allWorkouts.find((w) => w.id === 'another-workout-id');
    expect(savedWorkout).toBeDefined();
    expect(savedWorkout?.name).toBe('Pull Day');
  });

  it('should save workout with its workoutLines', async () => {
    workout.addExercise(workoutLine);
    await repo.saveWorkout(workout);

    const fetchedWorkout = await repo.getWorkoutById(workout.id);
    expect(fetchedWorkout).not.toBeNull();
    expect(fetchedWorkout?.exercises.length).toBe(1);
    expect(fetchedWorkout?.exercises[0].id).toBe(workoutLine.id);
  });

  it('should update an existing workout', async () => {
    const updatedWorkout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      name: 'Updated Push Day',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveWorkout(updatedWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);
    expect(allWorkouts[0].name).toBe('Updated Push Day');
  });

  it('should retrieve a workout by ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById(
      workoutTestProps.validWorkoutProps.id,
    );
    expect(fetchedWorkout).not.toBeNull();
    expect(fetchedWorkout?.name).toBe('Push Day');
  });

  it('should retrieve workouts by user ID', async () => {
    const userWorkouts = await repo.getAllWorkoutsByUserId(
      userTestProps.userId,
    );
    expect(userWorkouts.length).toBe(1);
    expect(userWorkouts[0].userId).toBe(userTestProps.userId);
  });

  it('should retrieve a workout by ID and user ID', async () => {
    const fetchedWorkout = await repo.getWorkoutByIdAndUserId(
      workoutTestProps.validWorkoutProps.id,
      userTestProps.userId,
    );
    expect(fetchedWorkout).not.toBeNull();
    expect(fetchedWorkout?.name).toBe('Push Day');
  });

  it('should retrieve workouts by template ID', async () => {
    const workouts = await repo.getWorkoutsByTemplateId(
      workoutTestProps.validWorkoutProps.workoutTemplateId,
    );
    expect(workouts.length).toBe(1);
    expect(workouts[0].workoutTemplateId).toBe(
      workoutTestProps.validWorkoutProps.workoutTemplateId,
    );
  });

  it('should retrieve workouts by template ID and user ID', async () => {
    const workouts = await repo.getWorkoutsByTemplateIdAndUserId(
      workoutTestProps.validWorkoutProps.workoutTemplateId,
      userTestProps.userId,
    );
    expect(workouts.length).toBe(1);
  });

  it('should return null for non-existent workout ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById('non-existent-id');
    expect(fetchedWorkout).toBeNull();
  });

  it('should delete a workout by ID', async () => {
    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);

    await repo.deleteWorkout(workoutTestProps.validWorkoutProps.id);

    const allWorkoutsAfterDeletion = await repo.getAllWorkouts();
    expect(allWorkoutsAfterDeletion.length).toBe(0);
  });

  it('should persist workout and workout lines to filesystem', async () => {
    workout.addExercise(workoutLine);
    await repo.saveWorkout(workout);

    // Verify workout file exists
    const workoutFilePath = path.join(testWorkoutsDir, `${workout.id}.json`);
    const workoutFileExists = await fs
      .access(workoutFilePath)
      .then(() => true)
      .catch(() => false);
    expect(workoutFileExists).toBe(true);

    // Verify workout line file exists
    const lineFilePath = path.join(
      testWorkoutLinesDir,
      `${workoutLine.id}.json`,
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(true);
  });

  it('should delete all workouts for a user', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Pull Day',
    });
    const workout3 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      userId: 'user-2',
      name: 'Leg Day',
    });
    await repo.saveWorkout(workout2);
    await repo.saveWorkout(workout3);

    const allWorkoutsBefore = await repo.getAllWorkouts();
    expect(allWorkoutsBefore.length).toBe(3);

    await repo.deleteAllWorkoutsForUser(userTestProps.userId);

    const allWorkoutsAfter = await repo.getAllWorkouts();
    expect(allWorkoutsAfter.length).toBe(1);
    expect(allWorkoutsAfter[0].userId).toBe('user-2');
  });
});
