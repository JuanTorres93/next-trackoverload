import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutByIdForUserUsecase } from '../GetWorkoutByIdForUser.usecase';

describe('GetWorkoutByIdUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getWorkoutByIdUsecase: GetWorkoutByIdForUserUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getWorkoutByIdUsecase = new GetWorkoutByIdForUserUsecase(workoutsRepo);
  });

  it('should return workout when it exists', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const result = await getWorkoutByIdUsecase.execute({
      id: vp.validWorkoutProps.id,
      userId: vp.userId,
    });

    expect(result).toEqual(toWorkoutDTO(workout));
  });

  it('should return WorkoutDTO', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      name: 'Push Day',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const result = await getWorkoutByIdUsecase.execute({
      id: vp.validWorkoutProps.id,
      userId: vp.userId,
    });

    expect(result).not.toBeInstanceOf(Workout);

    for (const prop of dto.workoutDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should return null when workout does not exist', async () => {
    const result = await getWorkoutByIdUsecase.execute({
      id: 'non-existent',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });
});
