import * as vp from '@/../tests/createProps';
import { Workout } from '@/domain/entities/workout/Workout';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryWorkoutsRepo } from '../MemoryWorkoutsRepo';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';

describe('MemoryWorkoutsRepo', () => {
  let repo: MemoryWorkoutsRepo;
  let workout: Workout;
  let workoutLine: WorkoutLine;

  beforeEach(async () => {
    repo = new MemoryWorkoutsRepo();
    workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises(),
      name: 'Push Day',
    });

    workoutLine = WorkoutLine.create({
      ...vp.validWorkoutLineProps,
    });

    await repo.saveWorkout(workout);
  });

  it('should save a workout', async () => {
    const newWorkout = Workout.create({
      ...vp.validWorkoutPropsNoExercises(),
      id: 'another-workout-id',
      name: 'Pull Day',
    });
    await repo.saveWorkout(newWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(2);
    expect(allWorkouts[1].name).toBe('Pull Day');
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
      ...vp.validWorkoutPropsNoExercises(),
      name: 'Updated Push Day',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveWorkout(updatedWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);
    expect(allWorkouts[0].name).toBe('Updated Push Day');
  });

  it('should retrieve a workout by ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById(vp.validWorkoutProps.id);
    expect(fetchedWorkout).not.toBeNull();
    expect(fetchedWorkout?.name).toBe('Push Day');
  });

  it('should return null for non-existent workout ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById('non-existent-id');
    expect(fetchedWorkout).toBeNull();
  });

  it('should delete a workout by ID', async () => {
    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);

    await repo.deleteWorkout(vp.validWorkoutProps.id);

    const allWorkoutsAfterDeletion = await repo.getAllWorkouts();
    expect(allWorkoutsAfterDeletion.length).toBe(0);
  });

  it('should delete all workouts for a user', async () => {
    const workout2 = Workout.create({
      ...vp.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Pull Day',
    });
    await repo.saveWorkout(workout2);

    const workout3 = Workout.create({
      ...vp.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      userId: 'user-2',
      name: 'Leg Day',
    });
    await repo.saveWorkout(workout3);

    const allWorkoutsBefore = await repo.getAllWorkouts();
    expect(allWorkoutsBefore.length).toBe(3);

    await repo.deleteAllWorkoutsForUser(vp.userId);

    const allWorkoutsAfter = await repo.getAllWorkouts();
    expect(allWorkoutsAfter.length).toBe(1);
    expect(allWorkoutsAfter[0].userId).toBe('user-2');
  });
});
