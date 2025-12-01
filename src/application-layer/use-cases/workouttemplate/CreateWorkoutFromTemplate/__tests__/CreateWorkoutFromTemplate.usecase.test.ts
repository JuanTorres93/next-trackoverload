import { beforeEach, describe, expect, it } from 'vitest';
import { CreateWorkoutFromTemplateUsecase } from '../CreateWorkoutFromTemplate.usecase';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { User } from '@/domain/entities/user/User';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Workout } from '@/domain/entities/workout/Workout';

describe('CreateWorkoutFromTemplateUsecase', () => {
  let workoutTemplatesRepo: MemoryWorkoutTemplatesRepo;
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateWorkoutFromTemplateUsecase;
  let user: User;

  beforeEach(async () => {
    workoutTemplatesRepo = new MemoryWorkoutTemplatesRepo();
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new CreateWorkoutFromTemplateUsecase(
      workoutTemplatesRepo,
      workoutsRepo,
      usersRepo
    );

    user = User.create({ ...vp.validUserProps });
    await usersRepo.saveUser(user);
  });

  it('should create workout from template ', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
    };

    const result = await usecase.execute(request);

    expect(result.name).toContain(vp.validWorkoutTemplateProps().name);
    expect(result.workoutTemplateId).toBe(vp.validWorkoutTemplateProps().id);
    expect(result.exercises).toHaveLength(
      vp
        .validWorkoutTemplateProps()
        .exercises.reduce((acc, ex) => acc + ex.sets, 0)
    ); // Sum of all sets of each exercise in template

    // Check exercise 1 sets
    const exercise1Sets = result.exercises.filter(
      (ex) =>
        ex.exerciseId === vp.validWorkoutTemplateProps().exercises[0].exerciseId
    );
    expect(exercise1Sets).toHaveLength(
      vp.validWorkoutTemplateProps().exercises[0].sets
    );
    expect(exercise1Sets[0]).toEqual({
      exerciseId: vp.validWorkoutTemplateProps().exercises[0].exerciseId,
      setNumber: 1,
      reps: 0,
      weight: 0,
    });
    expect(exercise1Sets[1].setNumber).toBe(2);
    expect(exercise1Sets[2].setNumber).toBe(3);

    // Check exercise 2 sets
    const exercise2Sets = result.exercises.filter(
      (ex) =>
        ex.exerciseId === vp.validWorkoutTemplateProps().exercises[1].exerciseId
    );
    expect(exercise2Sets).toHaveLength(
      vp.validWorkoutTemplateProps().exercises[1].sets
    );
    expect(exercise2Sets[0].setNumber).toBe(1);
    expect(exercise2Sets[1].setNumber).toBe(2);

    // Verify workout was saved
    const savedWorkout = await workoutsRepo.getWorkoutById(result.id);
    expect(savedWorkout).not.toBeNull();
    expect(savedWorkout!.name).toContain(vp.validWorkoutTemplateProps().name);
  });

  it('should return a WorkoutDTO', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(WorkoutTemplate);
    expect(result).not.toBeInstanceOf(Workout);
    for (const prop of dto.workoutDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create workout with custom name', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
      userId: vp.userId,
      workoutName: 'My Custom Workout',
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe('My Custom Workout');
    expect(result.workoutTemplateId).toBe(vp.validWorkoutTemplateProps().id);
  });

  it('should throw NotFoundError when template does not exist', async () => {
    const request = {
      workoutTemplateId: 'non-existent',
      userId: vp.userId,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error when template has no exercises', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
      exercises: [],
    });

    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw error when trying to create workout from deleted template', async () => {
    const template = WorkoutTemplate.create({
      ...vp.validWorkoutTemplateProps(),
    });

    template.markAsDeleted();
    await workoutTemplatesRepo.saveWorkoutTemplate(template);

    const request = {
      userId: vp.userId,
      workoutTemplateId: vp.validWorkoutTemplateProps().id,
    };

    await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      usecase.execute({
        userId: 'non-existent',
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      usecase.execute({
        userId: 'non-existent',
        workoutTemplateId: vp.validWorkoutTemplateProps().id,
      })
    ).rejects.toThrow(/CreateWorkoutFromTemplateUsecase.*User.*not.*found/);
  });
});
