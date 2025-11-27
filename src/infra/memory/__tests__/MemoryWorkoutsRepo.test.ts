import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryWorkoutsRepo } from '../MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { Id } from '@/domain/types/Id/Id';
import * as vp from '@/../tests/createProps';

describe('MemoryWorkoutsRepo', () => {
  let repo: MemoryWorkoutsRepo;
  let workout: Workout;

  beforeEach(async () => {
    repo = new MemoryWorkoutsRepo();
    workout = Workout.create({
      ...vp.validWorkoutProps,
      id: Id.create('1'),
      name: 'Push Day',
    });
    await repo.saveWorkout(workout);
  });

  it('should save a workout', async () => {
    const newWorkout = Workout.create({
      ...vp.validWorkoutProps,
      id: Id.create('2'),
      name: 'Pull Day',
    });
    await repo.saveWorkout(newWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(2);
    expect(allWorkouts[1].name).toBe('Pull Day');
  });

  it('should update an existing workout', async () => {
    const updatedWorkout = Workout.create({
      ...vp.validWorkoutProps,
      id: Id.create('1'),
      name: 'Updated Push Day',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveWorkout(updatedWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);
    expect(allWorkouts[0].name).toBe('Updated Push Day');
  });

  it('should retrieve a workout by ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById('1');
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

    await repo.deleteWorkout('1');

    const allWorkoutsAfterDeletion = await repo.getAllWorkouts();
    expect(allWorkoutsAfterDeletion.length).toBe(0);
  });
});
