import * as workoutTestProps from '../../../../../../tests/createProps/workoutTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { UpdateExerciseInWorkoutUsecase } from '../UpdateExerciseInWorkout.usecase';

describe('UpdateExerciseInWorkoutUsecase', () => {
  let workoutLine: WorkoutLine;
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let updateExerciseInWorkoutUsecase: UpdateExerciseInWorkoutUsecase;
  let user: User;
  let workout: Workout;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();

    updateExerciseInWorkoutUsecase = new UpdateExerciseInWorkoutUsecase(
      workoutsRepo,
      usersRepo,
    );

    user = userTestProps.createTestUser();

    workout = workoutTestProps.createTestWorkout();
    workoutLine = workout.exercises[0];

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  describe('Execution', () => {
    it('should update exercise reps in workout', async () => {
      const originalValues =
        workoutTestProps.validWorkoutPropsWithExercises().exercises[0];

      const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: workoutLine.exerciseId,
        reps: 15,
      });

      expect(updatedWorkout.exercises[0].reps).toBe(15);
      expect(updatedWorkout.exercises[0].reps).not.toBe(originalValues.reps);
      expect(updatedWorkout.exercises[0].setNumber).toBe(
        originalValues.setNumber,
      );
      expect(updatedWorkout.exercises[0].weightInKg).toBe(
        originalValues.weightInKg,
      );
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: workoutLine.exerciseId,
        reps: 15,
      });

      expect(updatedWorkout).not.toBeInstanceOf(Workout);
      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it('should update exercise weight in workout', async () => {
      const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: workoutLine.exerciseId,
        weightInKg: 25.5,
      });

      expect(updatedWorkout.exercises[0].weightInKg).toBe(25.5);
      expect(updatedWorkout.exercises[0].weightInKg).not.toBe(
        workoutTestProps.validWorkoutLineProps.weightInKg,
      );
      expect(updatedWorkout.exercises[0].reps).toBe(
        workoutTestProps.validWorkoutLineProps.reps,
      );
      expect(updatedWorkout.exercises[0].setNumber).toBe(
        workoutTestProps.validWorkoutLineProps.setNumber,
      );
    });

    it('should update exercise set number in workout', async () => {
      const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: workoutLine.exerciseId,
        setNumber: 2,
      });

      expect(updatedWorkout.exercises[0].setNumber).toBe(2);
      expect(updatedWorkout.exercises[0].setNumber).not.toBe(
        workoutTestProps.validWorkoutLineProps.setNumber,
      );
      expect(updatedWorkout.exercises[0].reps).toBe(
        workoutTestProps.validWorkoutLineProps.reps,
      );
      expect(updatedWorkout.exercises[0].weightInKg).toBe(
        workoutTestProps.validWorkoutPropsWithExercises().exercises[0]
          .weightInKg,
      );
    });

    it('should update multiple properties at once', async () => {
      const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
        userId: userTestProps.userId,
        workoutId: workout.id,
        exerciseId: workoutLine.exerciseId,
        setNumber: 3,
        reps: 12,
        weightInKg: 30,
      });

      expect(updatedWorkout.exercises[0].setNumber).toBe(3);
      expect(updatedWorkout.exercises[0].reps).toBe(12);
      expect(updatedWorkout.exercises[0].weightInKg).toBe(30);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        userId: userTestProps.userId,
        workoutId: 'non-existent',
        exerciseId: workoutTestProps.validWorkoutLineProps.exerciseId,
        reps: 15,
      };

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(/UpdateExerciseInWorkoutUsecase.*Workout.*not.*found/);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        workoutId: workout.id,
        exerciseId: workoutTestProps.validWorkoutLineProps.exerciseId,
        reps: 15,
      };

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(/UpdateExerciseInWorkoutUsecase.*User.*not.*found/);
    });

    it("should throw error when trying to update exercise in another user's workout", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: anotherUser.id,
        workoutId: workout.id,
        exerciseId: workoutTestProps.validWorkoutLineProps.exerciseId,
        reps: 20,
      };

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        updateExerciseInWorkoutUsecase.execute(request),
      ).rejects.toThrow(/UpdateExerciseInWorkoutUsecase.*Workout.*not.*found/);
    });
  });
});
