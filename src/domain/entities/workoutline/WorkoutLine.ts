import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Float } from '@/domain/value-objects/Float/Float';
import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';

export type WorkoutLineCreateProps = {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightInKg: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkoutLineUpdateProps = {
  setNumber?: number;
  reps?: number;
  weightInKg?: number;
};

export type WorkoutLineProps = {
  id: Id;
  workoutId: Id;
  exerciseId: Id;
  setNumber: Integer;
  reps: Integer;
  weightInKg: Float;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export const setNumberIntegerOptions = {
  onlyPositive: true,
  canBeZero: false,
};

const repsIntegerOptions = {
  onlyPositive: true,
};

const weightFloatOptions = {
  onlyPositive: true,
};

export class WorkoutLine {
  private constructor(private readonly props: WorkoutLineProps) {}

  static create(props: WorkoutLineCreateProps): WorkoutLine {
    const entityProps: WorkoutLineProps = {
      id: Id.create(props.id),
      workoutId: Id.create(props.workoutId),
      exerciseId: Id.create(props.exerciseId),
      setNumber: Integer.create(props.setNumber, setNumberIntegerOptions),
      reps: Integer.create(props.reps, repsIntegerOptions),
      weightInKg: Float.create(props.weightInKg, weightFloatOptions),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new WorkoutLine(entityProps);
  }

  update(patch: WorkoutLineUpdateProps) {
    if (patch.setNumber !== undefined) {
      this.props.setNumber = Integer.create(
        patch.setNumber,
        setNumberIntegerOptions,
      );
    }
    if (patch.reps !== undefined) {
      this.props.reps = Integer.create(patch.reps, repsIntegerOptions);
    }
    if (patch.weightInKg !== undefined) {
      this.props.weightInKg = Float.create(
        patch.weightInKg,
        weightFloatOptions,
      );
    }
    this.props.updatedAt = DomainDate.create();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get exerciseId() {
    return this.props.exerciseId.value;
  }

  get workoutId() {
    return this.props.workoutId.value;
  }

  get setNumber() {
    return this.props.setNumber.value;
  }

  get reps() {
    return this.props.reps.value;
  }

  get weightInKg() {
    return this.props.weightInKg.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
