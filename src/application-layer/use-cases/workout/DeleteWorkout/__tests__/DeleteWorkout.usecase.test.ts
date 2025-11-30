import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteWorkoutUsecase } from '../DeleteWorkout.usecase';

describe('DeleteWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let deleteWorkoutUsecase: DeleteWorkoutUsecase;
  let user: User;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    deleteWorkoutUsecase = new DeleteWorkoutUsecase(workoutsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should delete workout when it exists', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    // Verify workout exists
    const existingWorkout = await workoutsRepo.getWorkoutById(
      vp.validWorkoutProps.id
    );
    expect(existingWorkout).toBe(workout);

    await deleteWorkoutUsecase.execute({
      id: vp.validWorkoutProps.id,
      userId: vp.validWorkoutProps.userId,
    });

    // Verify workout is deleted
    const deletedWorkout = await workoutsRepo.getWorkoutById(
      vp.validWorkoutProps.id
    );
    expect(deletedWorkout).toBeNull();
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    await expect(
      deleteWorkoutUsecase.execute({
        id: 'non-existent',
        userId: vp.validWorkoutProps.userId,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error if user does not exist', async () => {
    const workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    await workoutsRepo.saveWorkout(workout);

    const request = {
      id: vp.validWorkoutProps.id,
      userId: 'non-existent',
    };

    await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
    await expect(deleteWorkoutUsecase.execute(request)).rejects.toThrow(
      /DeleteWorkoutUsecase.*user.*not.*found/
    );
  });
});
