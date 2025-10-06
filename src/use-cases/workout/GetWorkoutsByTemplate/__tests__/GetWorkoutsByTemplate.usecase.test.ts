import { beforeEach, describe, expect, it } from 'vitest';
import { GetWorkoutsByTemplateUsecase } from '../GetWorkoutsByTemplate.usecase';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Workout } from '@/domain/entities/workout/Workout';
import { ValidationError } from '@/domain/common/errors';

describe('GetWorkoutsByTemplateUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let getWorkoutsByTemplateUsecase: GetWorkoutsByTemplateUsecase;

  beforeEach(() => {
    workoutsRepo = new MemoryWorkoutsRepo();
    getWorkoutsByTemplateUsecase = new GetWorkoutsByTemplateUsecase(
      workoutsRepo
    );
  });

  it('should return workouts filtered by template id', async () => {
    const workout1 = Workout.create({
      id: '1',
      name: 'Push Day #1',
      workoutTemplateId: 'template-1',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const workout2 = Workout.create({
      id: '2',
      name: 'Pull Day #1',
      workoutTemplateId: 'template-2',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const workout3 = Workout.create({
      id: '3',
      name: 'Push Day #2',
      workoutTemplateId: 'template-1',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutsRepo.saveWorkout(workout1);
    await workoutsRepo.saveWorkout(workout2);
    await workoutsRepo.saveWorkout(workout3);

    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'template-1',
    });

    expect(workouts).toHaveLength(2);
    expect(workouts).toContain(workout1);
    expect(workouts).toContain(workout3);
    expect(workouts).not.toContain(workout2);
  });

  it('should return empty array when no workouts exist for template', async () => {
    const workout1 = Workout.create({
      id: '1',
      name: 'Push Day #1',
      workoutTemplateId: 'template-1',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutsRepo.saveWorkout(workout1);

    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'non-existent-template',
    });

    expect(workouts).toHaveLength(0);
  });

  it('should return empty array when no workouts exist at all', async () => {
    const workouts = await getWorkoutsByTemplateUsecase.execute({
      templateId: 'template-1',
    });

    expect(workouts).toHaveLength(0);
  });

  it('should throw ValidationError when templateId is invalid', async () => {
    const invalidTemplateIds = [
      '',
      '   ',
      null,
      undefined,
      123,
      {},
      [],
      true,
      false,
    ];

    for (const templateId of invalidTemplateIds) {
      await expect(
        // @ts-expect-error testing invalid inputs
        getWorkoutsByTemplateUsecase.execute({ templateId: templateId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
