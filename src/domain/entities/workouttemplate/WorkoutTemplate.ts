import { ValidationError } from '../../common/errors';
import { Id } from '@/domain/value-objects/Id/Id';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validateGreaterThanZero,
  validateNonEmptyString,
} from '../../common/validation';

export type TemplateLine = {
  exerciseId: string;
  sets: number;
};

type TemplateLineUpdateProps = {
  sets?: number;
};

export type WorkoutTemplateProps = {
  id: Id;
  userId: Id;
  name: string;
  exercises: TemplateLine[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export class WorkoutTemplate {
  private constructor(private readonly props: WorkoutTemplateProps) {
    // Deep copy to prevent external mutations in tests
    this.props = {
      ...props,
      exercises: props.exercises.map((exercise) => ({ ...exercise })),
    };
  }

  static create(props: WorkoutTemplateProps): WorkoutTemplate {
    if (!(props.id instanceof Id))
      throw new ValidationError('WorkoutTemplate id must be an instance of Id');

    if (!(props.userId instanceof Id))
      throw new ValidationError(
        'WorkoutTemplate userId must be an instance of Id'
      );

    validateNonEmptyString(props.name, 'WorkoutTemplate name');

    if (!Array.isArray(props.exercises)) {
      throw new ValidationError('WorkoutTemplate exercises must be an array');
    }

    for (const line of props.exercises) {
      if (
        !line.exerciseId ||
        !line.sets ||
        typeof line.sets !== 'number' ||
        line.sets <= 0
      ) {
        throw new ValidationError(
          'WorkoutTemplate exercises must be instances of TemplateLine'
        );
      }
    }

    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new WorkoutTemplate(props);
  }

  addExercise({ exerciseId, sets }: TemplateLine) {
    // NOTE: maybe allow duplicates in the future?
    const existingLine = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId
    );
    if (existingLine) {
      throw new ValidationError('WorkoutTemplate: Exercise already exists');
    }
    this.props.exercises.push({ exerciseId, sets });
  }

  removeExercise(exerciseId: string) {
    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId
    );
  }

  reorderExercise(exerciseId: string, newIndex: number) {
    const exercise = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId
    );
    if (!exercise) return;

    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId
    );
    this.props.exercises.splice(newIndex, 0, exercise);
  }

  updateExercise(exerciseId: string, updateProps: TemplateLineUpdateProps) {
    const exercise = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId
    );
    if (!exercise) return;

    if (updateProps.sets !== undefined) {
      validateGreaterThanZero(
        updateProps.sets,
        'WorkoutTemplate updateExercise sets'
      );
      exercise.sets = updateProps.sets;
    }
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

  get exercises() {
    return [...this.props.exercises];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  get isDeleted() {
    return this.props.deletedAt !== undefined;
  }

  markAsDeleted() {
    const now = new Date();
    this.props.deletedAt = now;
    this.props.updatedAt = now;
  }
}
