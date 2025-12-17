import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';
import { UpdateExerciseInWorkoutUsecase } from '../UpdateExerciseInWorkout.usecase';

describe('UpdateExerciseInWorkoutUsecase', () => {
  let workoutLine: WorkoutLine;
  let workoutsRepo: MemoryWorkoutsRepo;
  let usersRepo: MemoryUsersRepo;
  let updateExerciseInWorkoutUsecase: UpdateExerciseInWorkoutUsecase;
  let user: User;
  let workout: Workout;

  beforeEach(async () => {
    workoutLine = WorkoutLine.create({
      ...vp.validWorkoutLineProps,
    });

    workoutsRepo = new MemoryWorkoutsRepo();
    usersRepo = new MemoryUsersRepo();
    updateExerciseInWorkoutUsecase = new UpdateExerciseInWorkoutUsecase(
      workoutsRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });

    workout = Workout.create({
      ...vp.validWorkoutPropsNoExercises(),
      exercises: [workoutLine],
    });

    await usersRepo.saveUser(user);
    await workoutsRepo.saveWorkout(workout);
  });

  it('should update exercise reps in workout', async () => {
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: workoutLine.exerciseId,
      reps: 15,
    });

    expect(updatedWorkout.exercises[0].reps).toBe(15);
    expect(updatedWorkout.exercises[0].reps).not.toBe(
      vp.validWorkoutLineProps.reps
    );
    expect(updatedWorkout.exercises[0].setNumber).toBe(
      vp.validWorkoutLineProps.setNumber
    );
    expect(updatedWorkout.exercises[0].weight).toBe(
      vp.validWorkoutLineProps.weight
    );
  });

  it('should return WorkoutDTO', async () => {
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      reps: 15,
    });

    expect(updatedWorkout).not.toBeInstanceOf(Workout);
    for (const prop of dto.workoutDTOProperties) {
      expect(updatedWorkout).toHaveProperty(prop);
    }
  });

  it('should update exercise weight in workout', async () => {
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      weight: 25.5,
    });

    expect(updatedWorkout.exercises[0].weight).toBe(25.5);
    expect(updatedWorkout.exercises[0].weight).not.toBe(
      vp.validWorkoutLineProps.weight
    );
    expect(updatedWorkout.exercises[0].reps).toBe(
      vp.validWorkoutLineProps.reps
    );
    expect(updatedWorkout.exercises[0].setNumber).toBe(
      vp.validWorkoutLineProps.setNumber
    );
  });

  it('should update exercise set number in workout', async () => {
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      setNumber: 2,
    });

    expect(updatedWorkout.exercises[0].setNumber).toBe(2);
    expect(updatedWorkout.exercises[0].setNumber).not.toBe(
      vp.validWorkoutLineProps.setNumber
    );
    expect(updatedWorkout.exercises[0].reps).toBe(
      vp.validWorkoutLineProps.reps
    );
    expect(updatedWorkout.exercises[0].weight).toBe(
      vp.validWorkoutLineProps.weight
    );
  });

  it('should update multiple properties at once', async () => {
    const updatedWorkout = await updateExerciseInWorkoutUsecase.execute({
      userId: vp.userId,
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      setNumber: 3,
      reps: 12,
      weight: 30,
    });

    expect(updatedWorkout.exercises[0].setNumber).toBe(3);
    expect(updatedWorkout.exercises[0].reps).toBe(12);
    expect(updatedWorkout.exercises[0].weight).toBe(30);
  });

  it('should throw NotFoundError when workout does not exist', async () => {
    const request = {
      userId: vp.userId,
      workoutId: 'non-existent',
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      reps: 15,
    };

    await expect(
      updateExerciseInWorkoutUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);

    await expect(
      updateExerciseInWorkoutUsecase.execute(request)
    ).rejects.toThrow(/UpdateExerciseInWorkoutUsecase.*Workout.*not.*found/);
  });

  it('should throw error if user does not exist', async () => {
    const request = {
      userId: 'non-existent',
      workoutId: vp.validWorkoutProps.id,
      exerciseId: vp.validWorkoutLineProps.exerciseId,
      reps: 15,
    };

    await expect(
      updateExerciseInWorkoutUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);

    await expect(
      updateExerciseInWorkoutUsecase.execute(request)
    ).rejects.toThrow(/UpdateExerciseInWorkoutUsecase.*User.*not.*found/);
  });
});
