import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutsForUserUsecase } from '../GetAllWorkoutsForUser.usecase';

describe('GetAllWorkoutsUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getAllWorkoutsUsecase: GetAllWorkoutsForUserUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getAllWorkoutsUsecase = new GetAllWorkoutsForUserUsecase(workoutsRepo);
  });

  it('should return all workouts', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [],
    });
    const workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: 'another-workout-id',
      name: 'Pull Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);

    const workouts = await getAllWorkoutsUsecase.execute({ userId: vp.userId });

    const workoutIds = workouts.map((w) => w.id);

    expect(workouts).toHaveLength(2);
    expect(workoutIds).toContain(workout1.id);
    expect(workoutIds).toContain(workout2.id);
  });

  it('should return an array of WorkoutDTO', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [],
    });
    const workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: 'another-workout-id',
      name: 'Pull Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);

    const workouts = await getAllWorkoutsUsecase.execute({ userId: vp.userId });

    for (const workout of workouts) {
      expect(workout).not.toBeInstanceOf(Workout);

      for (const prop of dto.workoutDTOProperties) {
        expect(workout).toHaveProperty(prop);
      }
    }
  });

  it('should return empty array when no workouts exist', async () => {
    const workouts = await getAllWorkoutsUsecase.execute({ userId: vp.userId });
    expect(workouts).toHaveLength(0);
  });
});
