import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { MemoryExercisesRepo } from '@/infra/memory/MemoryExercisesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { Uuidv4IdGenerator } from '@/infra/services/Uuidv4IdGenerator';
import { AddExerciseToWorkoutUsecase } from '../AddExerciseToWorkout.usecase';

describe('AddExerciseToWorkoutUsecase', () => {
  let workoutsRepo: MemoryWorkoutsRepo;
  let exercisesRepo: MemoryExercisesRepo;
  let usersRepo: MemoryUsersRepo;
  let addExerciseToWorkoutUsecase: AddExerciseToWorkoutUsecase;
  let user: User;
  let workout: Workout;

  beforeEach(async () => {
    workoutsRepo = new MemoryWorkoutsRepo();
    exercisesRepo = new MemoryExercisesRepo();
    usersRepo = new MemoryUsersRepo();
    addExerciseToWorkoutUsecase = new AddExerciseToWorkoutUsecase(
      workoutsRepo,
      exercisesRepo,
      usersRepo,
      new Uuidv4IdGenerator()
    );

    user = User.create({
      ...vp.validUserProps,
    });

    workout = Workout.create({
      ...vp.validWorkoutProps,
      exercises: [],
    });

    const exercise = Exercise.create({
      ...vp.validExerciseProps,
      name: 'Push Up',
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
    await exercisesRepo.saveExercise(exercise);
  });

  describe('Execute', () => {
    it('should add exercise to workout', async () => {
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
      });

      expect(updatedWorkout.exercises).toHaveLength(1);
      expect(updatedWorkout.exercises[0]).toEqual({
        id: updatedWorkout.exercises[0].id,
        workoutId: workout.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
        createdAt: updatedWorkout.exercises[0].createdAt,
        updatedAt: updatedWorkout.exercises[0].updatedAt,
      });
    });

    it('should return WorkoutDTO', async () => {
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
      });

      for (const prop of dto.workoutDTOProperties) {
        expect(updatedWorkout).not.toBeInstanceOf(Workout);
        expect(updatedWorkout).toHaveProperty(prop);
      }
    });

    it('should add exercise with different set number', async () => {
      // First set
      await addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 12,
        weight: 5,
      });

      // Second set
      const updatedWorkout = await addExerciseToWorkoutUsecase.execute({
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 2,
        reps: 12,
        weight: 5,
      });

      expect(updatedWorkout.exercises).toHaveLength(2);
      expect(updatedWorkout.exercises[1]).toEqual({
        id: updatedWorkout.exercises[1].id,
        workoutId: workout.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 2,
        reps: 12,
        weight: 5,
        createdAt: updatedWorkout.exercises[1].createdAt,
        updatedAt: updatedWorkout.exercises[1].updatedAt,
      });
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when workout does not exist', async () => {
      const request = {
        userId: vp.userId,
        workoutId: 'non-existent',
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);

      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*Workout.*not found/);
    });

    it('should throw NotFoundError when exercise does not exist', async () => {
      const request = {
        userId: vp.userId,
        workoutId: vp.validWorkoutProps.id,
        exerciseId: 'non-existent',
        setNumber: 1,
        reps: 10,
        weight: 0,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);

      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*Exercise.*not found/);
    });

    it('should throw error if user does not exist', async () => {
      const workout = Workout.create({
        ...vp.validWorkoutProps,
        exercises: [],
      });

      const exercise = Exercise.create({
        ...vp.validExerciseProps,
        name: 'Push Up',
      });

      await workoutsRepo.saveWorkout(workout);
      await exercisesRepo.saveExercise(exercise);

      const request = {
        userId: 'non-existent',
        workoutId: vp.validWorkoutProps.id,
        exerciseId: vp.validExerciseProps.id,
        setNumber: 1,
        reps: 10,
        weight: 0,
      };

      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
      await expect(
        addExerciseToWorkoutUsecase.execute(request)
      ).rejects.toThrow(/AddExerciseToWorkoutUsecase.*user.*not.*found/);
    });
  });
});
