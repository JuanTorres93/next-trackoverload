import { Exercise } from '@/domain/entities/exercise/Exercise';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as exerciseTestProps from '../../../../../tests/createProps/exerciseTestProps';
import * as workoutTestProps from '../../../../../tests/createProps/workoutTestProps';
import { MongoExercisesRepo } from '../MongoExercisesRepo';
import { MongoWorkoutsRepo } from '../MongoWorkoutsRepo';
import WorkoutLineMongo from '../models/WorkoutLineMongo';
import WorkoutMongo from '../models/WorkoutMongo';
import { mockForThrowingError } from './mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from './setupMongoTestDB';

describe('MongoWorkoutsRepo', () => {
  let repo: MongoWorkoutsRepo;
  let exercisesRepo: MongoExercisesRepo;
  let workout: Workout;
  let exercise: Exercise;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    exercisesRepo = new MongoExercisesRepo();
    repo = new MongoWorkoutsRepo();

    // Create and save an exercise first (needed for workout lines)
    exercise = exerciseTestProps.createTestExercise();

    // Create a workout with workout lines
    const workoutLine = WorkoutLine.create({
      ...workoutTestProps.validWorkoutLineProps,
      id: 'line-1',
      workoutId: 'workout-1',
      exerciseId: exercise.id,
    });

    workout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-1',
      exercises: [workoutLine],
    });

    await exercisesRepo.saveExercise(exercise);
    await repo.saveWorkout(workout);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save a workout with its workout lines', async () => {
    const newExercise = exerciseTestProps.createTestExercise({
      id: 'exercise-2',
    });
    await exercisesRepo.saveExercise(newExercise);

    const workoutLine = WorkoutLine.create({
      ...workoutTestProps.validWorkoutLineProps,
      id: 'line-2',
      workoutId: 'workout-2',
      exerciseId: newExercise.id,
      setNumber: 1,
      reps: 12,
      weightInKg: 100,
    });

    const newWorkout = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Leg Day',
      exercises: [workoutLine],
    });
    await repo.saveWorkout(newWorkout);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(2);
    expect(allWorkouts[1].name).toBe('Leg Day');
    expect(allWorkouts[1].exercises).toHaveLength(1);
    expect(allWorkouts[1].exercises[0].exerciseId).toBe(newExercise.id);
  });

  it('should update an existing workout', async () => {
    const existingWorkout = await repo.getWorkoutById('workout-1');
    existingWorkout!.update({
      name: 'Updated Workout Name',
    });
    await repo.saveWorkout(existingWorkout!);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);
    expect(allWorkouts[0].name).toBe('Updated Workout Name');
  });

  it('should update workout lines when saving', async () => {
    const existingWorkout = await repo.getWorkoutById('workout-1');
    expect(existingWorkout!.exercises).toHaveLength(1);

    // Create a new exercise and add it to the workout
    const newExercise = exerciseTestProps.createTestExercise({
      id: 'exercise-3',
      name: 'Bench Press',
    });
    await exercisesRepo.saveExercise(newExercise);

    const newLine = WorkoutLine.create({
      ...workoutTestProps.validWorkoutLineProps,
      id: 'line-new',
      workoutId: existingWorkout!.id,
      exerciseId: newExercise.id,
      setNumber: 1,
      reps: 8,
      weightInKg: 80,
    });

    existingWorkout!.addExercise(newLine);
    await repo.saveWorkout(existingWorkout!);

    const updatedWorkout = await repo.getWorkoutById(existingWorkout!.id);
    expect(updatedWorkout!.exercises).toHaveLength(2);
    expect(updatedWorkout!.exercises.map((l) => l.exerciseId)).toContain(
      newExercise.id,
    );
  });

  it('should retrieve a workout by ID with its workout lines', async () => {
    const fetchedWorkout = await repo.getWorkoutById('workout-1');

    expect(fetchedWorkout!.id).toBe('workout-1');
    expect(fetchedWorkout!.name).toBe(
      workoutTestProps.validWorkoutPropsNoExercises().name,
    );
    expect(fetchedWorkout!.exercises).toHaveLength(1);
    expect(fetchedWorkout!.exercises[0].exerciseId).toBe(exercise.id);
  });

  it('should return null for non-existent workout ID', async () => {
    const fetchedWorkout = await repo.getWorkoutById('non-existent-id');

    expect(fetchedWorkout).toBeNull();
  });

  it('should retrieve all workouts for a specific user', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Another Workout',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-w2',
          workoutId: 'workout-2',
          exerciseId: exercise.id,
          reps: 12,
        }),
      ],
    });

    const workoutOtherUser = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      userId: 'other-user',
      name: 'Other User Workout',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-w3',
          workoutId: 'workout-3',
          exerciseId: exercise.id,
          reps: 15,
        }),
      ],
    });

    await repo.saveWorkout(workout2);
    await repo.saveWorkout(workoutOtherUser);

    const userWorkouts = await repo.getAllWorkoutsByUserId(
      workoutTestProps.validWorkoutPropsNoExercises().userId,
    );

    expect(userWorkouts).toHaveLength(2);
    expect(
      userWorkouts.every(
        (w) =>
          w.userId === workoutTestProps.validWorkoutPropsNoExercises().userId,
      ),
    ).toBe(true);
  });

  it('should retrieve a workout by ID and user ID', async () => {
    const fetchedWorkout = await repo.getWorkoutByIdAndUserId(
      'workout-1',
      workoutTestProps.validWorkoutPropsNoExercises().userId,
    );

    expect(fetchedWorkout).not.toBeNull();
    expect(fetchedWorkout!.id).toBe('workout-1');
    expect(fetchedWorkout!.userId).toBe(
      workoutTestProps.validWorkoutPropsNoExercises().userId,
    );
  });

  it('should return null when workout ID and user ID do not match', async () => {
    const fetchedWorkout = await repo.getWorkoutByIdAndUserId(
      'workout-1',
      'wrong-user-id',
    );

    expect(fetchedWorkout).toBeNull();
  });

  it('should retrieve workouts by template ID and user ID', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Same Template Workout',
      workoutTemplateId:
        workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-w2',
          workoutId: 'workout-2',
          exerciseId: exercise.id,
          reps: 10,
        }),
      ],
    });

    const workoutDifferentTemplate = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      name: 'Different Template Workout',
      workoutTemplateId: 'different-template-id',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-w3',
          workoutId: 'workout-3',
          exerciseId: exercise.id,
          reps: 8,
        }),
      ],
    });

    await repo.saveWorkout(workout2);
    await repo.saveWorkout(workoutDifferentTemplate);

    const workoutsFromTemplate = await repo.getWorkoutsByTemplateIdAndUserId(
      workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
      workoutTestProps.validWorkoutPropsNoExercises().userId,
    );

    expect(workoutsFromTemplate).toHaveLength(2);
    expect(
      workoutsFromTemplate.every(
        (w) =>
          w.workoutTemplateId ===
          workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
      ),
    ).toBe(true);
  });

  it('should retrieve workouts by template ID', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Same Template, Different User',
      userId: 'other-user',
      workoutTemplateId:
        workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-w2',
          workoutId: 'workout-2',
          exerciseId: exercise.id,
          reps: 10,
        }),
      ],
    });

    await repo.saveWorkout(workout2);

    const workoutsFromTemplate = await repo.getWorkoutsByTemplateId(
      workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
    );

    expect(workoutsFromTemplate).toHaveLength(2);
    expect(
      workoutsFromTemplate.every(
        (w) =>
          w.workoutTemplateId ===
          workoutTestProps.validWorkoutPropsNoExercises().workoutTemplateId,
      ),
    ).toBe(true);
  });

  it('should retrieve all workouts', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      name: 'Workout 2',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-2',
          workoutId: 'workout-2',
          exerciseId: exercise.id,
          reps: 8,
        }),
      ],
    });
    const workout3 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      name: 'Workout 3',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-3',
          workoutId: 'workout-3',
          exerciseId: exercise.id,
          reps: 12,
        }),
      ],
    });

    await repo.saveWorkout(workout2);
    await repo.saveWorkout(workout3);

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts).toHaveLength(3);
  });

  it('should delete a workout and its workout lines by ID', async () => {
    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts.length).toBe(1);

    const workoutLinesBeforeDeletion = await WorkoutLineMongo.find({
      workoutId: 'workout-1',
    });
    expect(workoutLinesBeforeDeletion).toHaveLength(1);

    await repo.deleteWorkout('workout-1');

    const allWorkoutsAfterDeletion = await repo.getAllWorkouts();
    expect(allWorkoutsAfterDeletion.length).toBe(0);

    const workoutLinesAfterDeletion = await WorkoutLineMongo.find({
      workoutId: 'workout-1',
    });
    expect(workoutLinesAfterDeletion).toHaveLength(0);
  });

  it('should reject with null when trying to delete a non-existent workout', async () => {
    await expect(repo.deleteWorkout('non-existent-id')).rejects.toEqual(null);
  });

  it('should delete all workouts for a user', async () => {
    const workout2 = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-2',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-2',
          workoutId: 'workout-2',
          exerciseId: exercise.id,
          reps: 10,
        }),
      ],
    });
    const workoutOtherUser = Workout.create({
      ...workoutTestProps.validWorkoutPropsNoExercises(),
      id: 'workout-3',
      userId: 'other-user',
      exercises: [
        WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-3',
          workoutId: 'workout-3',
          exerciseId: exercise.id,
          reps: 15,
        }),
      ],
    });

    await repo.saveWorkout(workout2);
    await repo.saveWorkout(workoutOtherUser);

    const workoutLinesBeforeDeletion = await WorkoutLineMongo.find({
      workoutId: 'workout-1',
    });
    expect(workoutLinesBeforeDeletion).toHaveLength(1);

    await repo.deleteAllWorkoutsForUser(
      workoutTestProps.validWorkoutPropsNoExercises().userId,
    );

    const allWorkouts = await repo.getAllWorkouts();
    expect(allWorkouts).toHaveLength(1);
    expect(allWorkouts[0].userId).toBe('other-user');

    const workoutLinesAfterDeletion = await WorkoutLineMongo.find({
      workoutId: 'workout-1',
    });
    expect(workoutLinesAfterDeletion).toHaveLength(0);
  });

  describe('transactions', () => {
    describe('saveWorkout', () => {
      it('should rollback changes if error in workout find and update', async () => {
        mockForThrowingError(WorkoutMongo, 'findOneAndUpdate');

        const existingWorkout = await repo.getWorkoutById('workout-1');
        existingWorkout!.update({
          name: 'Updated Workout Name',
        });

        // Try to save workout - should throw error
        await expect(repo.saveWorkout(existingWorkout!)).rejects.toThrow(
          /Mocked error.*findOneAndUpdate/i,
        );

        const notUpdatedWorkout = await repo.getWorkoutById('workout-1');
        expect(notUpdatedWorkout!.name).toBe(
          workoutTestProps.validWorkoutPropsNoExercises().name,
        );
      });

      it('should rollback changes if error in deleteMany workout lines', async () => {
        mockForThrowingError(WorkoutLineMongo, 'deleteMany');

        const existingWorkout = await repo.getWorkoutById('workout-1');
        existingWorkout!.update({
          name: 'Updated Workout Name',
        });

        const anotherExercise = exerciseTestProps.createTestExercise({
          id: 'exercise-2',
          name: 'Deadlift',
        });
        await exercisesRepo.saveExercise(anotherExercise);

        const newLine = WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-new',
          workoutId: existingWorkout!.id,
          exerciseId: anotherExercise.id,
          setNumber: 1,
          reps: 5,
          weightInKg: 120,
        });

        existingWorkout!.addExercise(newLine);

        // Try to save workout
        await expect(repo.saveWorkout(existingWorkout!)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        const notUpdatedWorkout = await repo.getWorkoutById('workout-1');
        expect(notUpdatedWorkout!.name).toBe(
          workoutTestProps.validWorkoutPropsNoExercises().name,
        );
        expect(notUpdatedWorkout!.exercises).toHaveLength(1);
        expect(notUpdatedWorkout!.exercises[0].exerciseId).toBe(exercise.id);
      });

      it('should rollback changes if error in insertMany workout lines', async () => {
        mockForThrowingError(WorkoutLineMongo, 'insertMany');

        const existingWorkout = await repo.getWorkoutById('workout-1');
        existingWorkout!.update({
          name: 'Updated Workout Name',
        });

        const anotherExercise = exerciseTestProps.createTestExercise({
          id: 'exercise-2',
          name: 'Deadlift',
        });
        await exercisesRepo.saveExercise(anotherExercise);

        const newLine = WorkoutLine.create({
          ...workoutTestProps.validWorkoutLineProps,
          id: 'line-new',
          workoutId: existingWorkout!.id,
          exerciseId: anotherExercise.id,
          setNumber: 1,
          reps: 5,
          weightInKg: 120,
        });

        existingWorkout!.addExercise(newLine);

        // Try to save workout
        await expect(repo.saveWorkout(existingWorkout!)).rejects.toThrow(
          /Mocked error.*insertMany/i,
        );

        const notUpdatedWorkout = await repo.getWorkoutById('workout-1');
        expect(notUpdatedWorkout!.name).toBe(
          workoutTestProps.validWorkoutPropsNoExercises().name,
        );
        expect(notUpdatedWorkout!.exercises).toHaveLength(1);
        expect(notUpdatedWorkout!.exercises[0].exerciseId).toBe(exercise.id);
      });
    });

    describe('deleteWorkout', () => {
      it('should rollback changes if error occurs when deleting workout lines', async () => {
        mockForThrowingError(WorkoutLineMongo, 'deleteMany');

        const workoutId = 'workout-1';

        const initialWorkoutCount = await repo.getAllWorkouts();
        expect(initialWorkoutCount.length).toBe(1);

        const initialWorkout = await repo.getWorkoutById(workoutId);
        expect(initialWorkout).not.toBeNull();
        expect(initialWorkout!.exercises).toHaveLength(1);
        const initialWorkoutLineId = initialWorkout!.exercises[0].id;

        // Try to delete workout
        await expect(repo.deleteWorkout(workoutId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the workout still exists
        const workoutsAfterFailedDelete = await repo.getAllWorkouts();
        expect(workoutsAfterFailedDelete.length).toBe(1);

        const workoutAfterFailedDelete = await repo.getWorkoutById(workoutId);
        expect(workoutAfterFailedDelete).not.toBeNull();
        expect(workoutAfterFailedDelete!.id).toBe(workoutId);

        // Verify that the workout lines still exist
        expect(workoutAfterFailedDelete!.exercises).toHaveLength(1);
        expect(workoutAfterFailedDelete!.exercises[0].id).toBe(
          initialWorkoutLineId,
        );
      });

      it('should rollback changes if error when deleting workout', async () => {
        mockForThrowingError(WorkoutMongo, 'deleteOne');

        const workoutId = 'workout-1';

        const initialWorkoutCount = await repo.getAllWorkouts();
        expect(initialWorkoutCount.length).toBe(1);

        const initialWorkout = await repo.getWorkoutById(workoutId);
        expect(initialWorkout).not.toBeNull();
        expect(initialWorkout!.exercises).toHaveLength(1);
        const initialWorkoutLineId = initialWorkout!.exercises[0].id;

        // Try to delete workout
        await expect(repo.deleteWorkout(workoutId)).rejects.toThrow(
          /Mocked error.*deleteOne/i,
        );

        // Verify that rollback worked: the workout still exists
        const workoutsAfterFailedDelete = await repo.getAllWorkouts();
        expect(workoutsAfterFailedDelete.length).toBe(1);

        const workoutAfterFailedDelete = await repo.getWorkoutById(workoutId);
        expect(workoutAfterFailedDelete).not.toBeNull();
        expect(workoutAfterFailedDelete!.id).toBe(workoutId);

        // Verify that the workout lines still exist
        expect(workoutAfterFailedDelete!.exercises).toHaveLength(1);
        expect(workoutAfterFailedDelete!.exercises[0].id).toBe(
          initialWorkoutLineId,
        );
      });
    });

    describe('deleteAllWorkoutsForUser', () => {
      it('should rollback changes if error occurs when deleting workout lines', async () => {
        mockForThrowingError(WorkoutLineMongo, 'deleteMany');

        const userId = workoutTestProps.validWorkoutPropsNoExercises().userId;

        const initialWorkouts = await repo.getAllWorkoutsByUserId(userId);
        expect(initialWorkouts).toHaveLength(1);

        const initialWorkoutLineId = initialWorkouts[0].exercises[0].id;

        // Try to delete workouts for user
        await expect(repo.deleteAllWorkoutsForUser(userId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the workout still exists
        const workoutsAfterFailedDelete =
          await repo.getAllWorkoutsByUserId(userId);
        expect(workoutsAfterFailedDelete).toHaveLength(1);

        const workoutAfterFailedDelete = workoutsAfterFailedDelete[0];
        expect(workoutAfterFailedDelete.id).toBe('workout-1');

        // Verify that the workout lines still exist
        expect(workoutAfterFailedDelete.exercises).toHaveLength(1);
        expect(workoutAfterFailedDelete.exercises[0].id).toBe(
          initialWorkoutLineId,
        );
      });

      it('should rollback changes if error occurs when deleting workouts', async () => {
        mockForThrowingError(WorkoutMongo, 'deleteMany');

        const userId = workoutTestProps.validWorkoutPropsNoExercises().userId;

        const initialWorkouts = await repo.getAllWorkoutsByUserId(userId);
        expect(initialWorkouts).toHaveLength(1);

        const initialWorkoutLineId = initialWorkouts[0].exercises[0].id;

        // Try to delete workouts for user
        await expect(repo.deleteAllWorkoutsForUser(userId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the workout still exists
        const workoutsAfterFailedDelete =
          await repo.getAllWorkoutsByUserId(userId);
        expect(workoutsAfterFailedDelete).toHaveLength(1);

        const workoutAfterFailedDelete = workoutsAfterFailedDelete[0];
        expect(workoutAfterFailedDelete.id).toBe('workout-1');

        // Verify that the workout lines still exist
        expect(workoutAfterFailedDelete.exercises).toHaveLength(1);
        expect(workoutAfterFailedDelete.exercises[0].id).toBe(
          initialWorkoutLineId,
        );
      });
    });
  });
});
