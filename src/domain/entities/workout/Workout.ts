import { ValidationError } from '../../common/errors';
import { Id } from '@/domain/value-objects/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Text } from '@/domain/value-objects/Text/Text';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { WorkoutLine } from '../workoutline/WorkoutLine';

type WorkoutLineUpdateProps = {
  setNumber?: number;
  reps?: number;
  weight?: number;
};

export type WorkoutCreateProps = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: WorkoutLine[];
  createdAt: Date;
  updatedAt: Date;
};

export type WorkoutProps = {
  id: Id;
  userId: Id;
  name: Text;
  workoutTemplateId: Id;
  exercises: WorkoutLine[];
  createdAt: Date;
  updatedAt: Date;
};

const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};

export class Workout {
  private constructor(private readonly props: WorkoutProps) {}

  static create(props: WorkoutCreateProps): Workout {
    if (!Array.isArray(props.exercises)) {
      throw new ValidationError('Workout: exercises must be an array');
    }

    const workoutProps: WorkoutProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      workoutTemplateId: Id.create(props.workoutTemplateId),
      exercises: props.exercises,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Workout(workoutProps);
  }

  addExercise(line: WorkoutLine) {
    // NOTE: maybe allow duplicates in the future?
    const existingLine = this.props.exercises.find(
      (l) => l.exerciseId === line.exerciseId && l.setNumber === line.setNumber
    );
    if (existingLine) {
      throw new ValidationError('Workout: Exercise already exists');
    }

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
      const exerciseLines = this.props.exercises
        .filter((line) => line.exerciseId === exerciseId)
        .sort((a, b) => a.setNumber - b.setNumber);

      // Reorder set numbers to be consecutive (1, 2, 3, ...)
      exerciseLines.forEach((line, index) => {
        line.update({
          setNumber: index + 1,
        });
      });

      this.props.updatedAt = new Date();
    }
  }

  updateExercise(exerciseId: string, updateProps: WorkoutLineUpdateProps) {
    const line = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId
    );
    if (!line) {
      throw new ValidationError('Workout: Exercise not found');
    }

    if (updateProps.setNumber !== undefined) {
      line.update({ setNumber: updateProps.setNumber });
    }
    if (updateProps.reps !== undefined) {
      line.update({ reps: updateProps.reps });
    }
    if (updateProps.weight !== undefined) {
      line.update({ weight: updateProps.weight });
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
    return this.props.name.value;
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
