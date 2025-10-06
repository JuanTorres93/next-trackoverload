import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllWorkoutsUsecase } from '../GetAllWorkouts.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';

describe('GetAllWorkoutsUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getAllWorkoutsUsecase: GetAllWorkoutsUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getAllWorkoutsUsecase = new GetAllWorkoutsUsecase(workoutsRepo);
  });

  it('should return all workouts', async () => {
    const workout1 = Workout.create({
      id: '1',
      name: 'Push Day',
      workoutTemplateId: 'template-1',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const workout2 = Workout.create({
      id: '2',
      name: 'Pull Day',
      workoutTemplateId: 'template-2',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);

    const workouts = await getAllWorkoutsUsecase.execute();

    expect(workouts).toHaveLength(2);
    expect(workouts).toContain(workout1);
    expect(workouts).toContain(workout2);
  });

  it('should return empty array when no workouts exist', async () => {
    const workouts = await getAllWorkoutsUsecase.execute();

    expect(workouts).toHaveLength(0);
  });
});
