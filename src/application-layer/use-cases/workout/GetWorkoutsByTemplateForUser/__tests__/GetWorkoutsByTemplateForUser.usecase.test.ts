import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutsByTemplateForUserUsecase } from '../GetWorkoutsByTemplateForUser.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetWorkoutsByTemplateUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getWorkoutsByTemplateUsecase: GetWorkoutsByTemplateForUserUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getWorkoutsByTemplateUsecase = new GetWorkoutsByTemplateForUserUsecase(
      workoutsRepo
    );
  });

  it('should return workouts filtered by template id', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day #1',
      exercises: [],
    });

    const workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: '2',
      name: 'Pull Day #1',
      workoutTemplateId: 'template-2',
      exercises: [],
    });

    const workout3 = Workout.create({
      ...vp.validWorkoutProps,
      id: '3',
      name: 'Push Day #2',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);
    await workoutsRepo.saveWorkout(workout3);

    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'template-1',
      userId: vp.userId,
    });

    const workoutIds = workouts.map((w) => w.id);

    expect(workouts).toHaveLength(2);
    expect(workoutIds).toContain(workout1.id);
    expect(workoutIds).toContain(workout3.id);
    expect(workoutIds).not.toContain(workout2.id);
  });

  it('should return array of WorkoutDTO', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day #1',
      exercises: [],
    });

    const workout2 = Workout.create({
      ...vp.validWorkoutProps,
      id: '2',
      name: 'Push Day #2',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);

    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'template-1',
      userId: vp.userId,
    });

    for (const workout of workouts) {
      expect(workout).not.toBeInstanceOf(Workout);

      for (const prop of dto.workoutDTOProperties) {
        expect(workout).toHaveProperty(prop);
      }
    }
  });

  it('should return empty array when no workouts exist for template', async () => {
    const workout1 = Workout.create({
      ...vp.validWorkoutProps,
      id: '1',
      name: 'Push Day #1',
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout1);

    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'non-existent-template',
      userId: vp.userId,
    });

    expect(workouts).toHaveLength(0);
  });

  it('should return empty array when no workouts exist at all', async () => {
    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'template-1',
      userId: vp.userId,
    });

    expect(workouts).toHaveLength(0);
  });
});
