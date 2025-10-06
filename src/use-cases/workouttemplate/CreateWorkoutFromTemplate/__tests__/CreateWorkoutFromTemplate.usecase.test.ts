import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkoutFromTemplateUsecase } from '../CreateWorkoutFromTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

describe('CreateWorkoutFromTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let workoutsRepo: MemoryWorkoutsRepo;
  let usecase: CreateWorkoutFromTemplateUsecase;

  beforeEach(() => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    workoutsRepo = new MemoryWorkoutsRepo();
    usecase = new CreateWorkoutFromTemplateUsecase(
      workoutTemplatesRepo,
      workoutsRepo
    );
  });

  it('should create workout from template ', async () => {
    const template = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3 },
        { exerciseId: 'shoulder-press', sets: 2 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      workoutTemplateId: '1',
    };

    const result = await usecase.execute(request);

    expect(result.name).toContain('Push Day');
    expect(result.workoutTemplateId).toBe('1');
    expect(result.exercises).toHaveLength(5); // 3 sets + 2 sets

    // Check bench press sets
    const benchPressSets = result.exercises.filter(
      (ex) => ex.exerciseId === 'bench-press'
    );
    expect(benchPressSets).toHaveLength(3);
    expect(benchPressSets[0]).toEqual({
      exerciseId: 'bench-press',
      setNumber: 1,
      reps: 0,
      weight: 0,
    });
    expect(benchPressSets[1].setNumber).toBe(2);
    expect(benchPressSets[2].setNumber).toBe(3);

    // Check shoulder press sets
    const shoulderPressSets = result.exercises.filter(
      (ex) => ex.exerciseId === 'shoulder-press'
    );
    expect(shoulderPressSets).toHaveLength(2);
    expect(shoulderPressSets[0].setNumber).toBe(1);
    expect(shoulderPressSets[1].setNumber).toBe(2);

    // Verify workout was saved
    const savedWorkout = await workoutsRepo.getWorkoutById(result.id);
    expect(savedWorkout).not.toBeNull();
    expect(savedWorkout!.name).toContain('Push Day');
  });

  it('should create workout with custom name', async () => {
    const template = WorkoutTemplate.create({
      id: '1',
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 2 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      workoutTemplateId: '1',
      workoutName: 'My Custom Workout',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('My Custom Workout');
    expect(result.workoutTemplateId).toBe('1');
    expect(result.exercises).toHaveLength(2);
    expect(result.exercises[0]).toEqual({
      exerciseId: 'bench-press',
      setNumber: 1,
      reps: 0,
      weight: 0,
    });
    expect(result.exercises[1]).toEqual({
      exerciseId: 'bench-press',
      setNumber: 2,
      reps: 0,
      weight: 0,
    });
  });

  it('should throw NotFoundError when template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error when template has no exercises', async () => {
    const template = WorkoutTemplate.create({
      id: '1',
      name: 'Empty Template',
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      workoutTemplateId: '1',
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when workout name is invalid', async () => {
    const invalidNames = ['', '   ', null, 3, [], {}, true];

    for (const name of invalidNames) {
      const request = {
        workoutTemplateId: '1',
        workoutName: name,
      };

      // @ts-expect-error testing invalid inputs
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });
});
