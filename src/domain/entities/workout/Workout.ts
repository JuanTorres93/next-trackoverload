import { ValidationError } from '../../common/errors';
import { Id } from '@/domain/types/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
  validatePositiveNumber,
  validateInteger,
} from '../../common/validation';

export type ExerciseLine = {
  // TODO change exerciseId to Id type
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number; // in kg
};

const validateExerciseLine = (line: ExerciseLine) => {
  validateNonEmptyString(line.exerciseId, 'ExerciseLine exerciseId');
  validateGreaterThanZero(line.setNumber, 'ExerciseLine setNumber');
  validatePositiveNumber(line.reps, 'ExerciseLine reps');
  validateInteger(line.reps, 'ExerciseLine reps');
  validatePositiveNumber(line.weight, 'ExerciseLine weight');
};

type ExerciseLineUpdateProps = {
  setNumber?: number;
  reps?: number;
  weight?: number;
};

export type WorkoutProps = {
  id: Id;
  userId: Id;
  name: string;
  workoutTemplateId: Id;
  exercises: ExerciseLine[];
  createdAt: Date;
  updatedAt: Date;
};

export class Workout {
  private constructor(private readonly props: WorkoutProps) {}

  static create(props: WorkoutProps): Workout {
    if (!(props.id instanceof Id))
      throw new ValidationError('Workout: id must be an instance of Id');

    if (!(props.userId instanceof Id))
      throw new ValidationError('Workout: userId must be an instance of Id');

    validateNonEmptyString(props.name, 'Workout name');
    if (!(props.workoutTemplateId instanceof Id)) {
      throw new ValidationError(
        'Workout: workoutTemplateId must be an instance of Id'
      );
    }
    if (!Array.isArray(props.exercises)) {
      throw new ValidationError('Workout: exercises must be an array');
    }

    for (const line of props.exercises) {
      validateExerciseLine(line);
    }

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Workout(props);
  }

  addExercise(line: ExerciseLine) {
    // NOTE: maybe allow duplicates in the future?
    const existingLine = this.props.exercises.find(
      (l) => l.exerciseId === line.exerciseId && l.setNumber === line.setNumber
    );
    if (existingLine) {
      throw new ValidationError('Workout: Exercise already exists');
    }

    validateExerciseLine(line);

    this.props.exercises.push(line);
    this.props.updatedAt = new Date();
  }

  removeExercise(exerciseId: string) {
    const initialLength = this.props.exercises.length;
    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId
    );
    if (this.props.exercises.length !== initialLength) {
      this.props.updatedAt = new Date();
    }
  }

  removeSet(exerciseId: string, setNumber: number) {
    const initialLength = this.props.exercises.length;

    // Remove the specific set
    this.props.exercises = this.props.exercises.filter(
      (line) =>
        !(line.exerciseId === exerciseId && line.setNumber === setNumber)
    );

    // If a set was actually removed, reorder the remaining sets for this exercise
    if (this.props.exercises.length !== initialLength) {
      // Get all sets for this exercise and sort by setNumber
      const exerciseSets = this.props.exercises
        .filter((line) => line.exerciseId === exerciseId)
        .sort((a, b) => a.setNumber - b.setNumber);

      // Reorder set numbers to be consecutive (1, 2, 3, ...)
      exerciseSets.forEach((set, index) => {
        set.setNumber = index + 1;
      });

      this.props.updatedAt = new Date();
    }
  }

  updateExercise(exerciseId: string, updateProps: ExerciseLineUpdateProps) {
    const line = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId
    );
    if (!line) {
      throw new ValidationError('Workout: Exercise not found');
    }

    if (updateProps.setNumber !== undefined) {
      validateGreaterThanZero(
        updateProps.setNumber,
        'Workout ExerciseLine setNumber'
      );
      line.setNumber = updateProps.setNumber;
    }
    if (updateProps.reps !== undefined) {
      validatePositiveNumber(updateProps.reps, 'Workout ExerciseLine reps');
      validateInteger(updateProps.reps, 'Workout ExerciseLine reps');
      line.reps = updateProps.reps;
    }
    if (updateProps.weight !== undefined) {
      validatePositiveNumber(updateProps.weight, 'Workout ExerciseLine weight');
      line.weight = updateProps.weight;
    }

    this.props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get name() {
    return this.props.name;
  }

  get workoutTemplateId() {
    return this.props.workoutTemplateId.value;
  }

  get exercises() {
    return [...this.props.exercises];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
