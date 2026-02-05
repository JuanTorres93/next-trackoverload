import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { Text } from '@/domain/value-objects/Text/Text';
import { ValidationError } from '../../common/errors';
import { WorkoutLine } from '../workoutline/WorkoutLine';
import { setNumberIntegerOptions } from '../workoutline/WorkoutLine';

type WorkoutLineUpdateProps = {
  setNumber?: number;
  reps?: number;
  weightInKg?: number;
};

export type WorkoutCreateProps = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: WorkoutLine[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkoutUpdateProps = {
  name?: string;
};

export type WorkoutProps = {
  id: Id;
  userId: Id;
  name: Text;
  workoutTemplateId: Id;
  exercises: WorkoutLine[];
  createdAt: DomainDate;
  updatedAt: DomainDate;
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
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Workout(workoutProps);
  }

  addExercise(newLine: WorkoutLine) {
    // NOTE: maybe allow duplicates in the future?
    const existingLine = this.props.exercises.find(
      (line) =>
        line.exerciseId === newLine.exerciseId &&
        line.setNumber === newLine.setNumber,
    );
    if (existingLine) {
      throw new ValidationError('Workout: Exercise already exists');
    }

    this.props.exercises.push(newLine);
    this.props.updatedAt = DomainDate.create();
  }

  removeExercise(exerciseId: string) {
    const initialLength = this.props.exercises.length;
    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId,
    );
    if (this.props.exercises.length !== initialLength) {
      this.props.updatedAt = DomainDate.create();
    }
  }

  removeSet(exerciseId: string, setNumber: number) {
    const exerciseExists = this.props.exercises.some(
      (line) => line.exerciseId === exerciseId,
    );
    if (!exerciseExists) {
      throw new ValidationError(
        'Workout: Cannot remove set from exercise that does not exist in workout',
      );
    }

    const validatedSetNumber = Integer.create(
      setNumber,
      setNumberIntegerOptions,
    ).value;

    const initialLength = this.props.exercises.length;

    // Remove the specific set
    this.props.exercises = this.props.exercises.filter(
      (line) =>
        !(
          line.exerciseId === exerciseId &&
          line.setNumber === validatedSetNumber
        ),
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

      this.props.updatedAt = DomainDate.create();
    }
  }

  update(patch: WorkoutUpdateProps) {
    if (!patch || Object.keys(patch).length === 0) {
      throw new ValidationError('Workout: No patch provided for update');
    }

    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }

    this.props.updatedAt = DomainDate.create();
  }

  updateExercise(exerciseId: string, updateProps: WorkoutLineUpdateProps) {
    const line = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId,
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
    if (updateProps.weightInKg !== undefined) {
      line.update({ weightInKg: updateProps.weightInKg });
    }

    this.props.updatedAt = DomainDate.create();
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
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
