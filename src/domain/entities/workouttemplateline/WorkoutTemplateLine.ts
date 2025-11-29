import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';

export type WorkoutTemplateLineCreateProps = {
  id: string;
  exerciseId: string;
  sets: number;
  createdAt: Date;
  updatedAt: Date;
};

export type WorkoutTemplateLineUpdateProps = {
  exerciseId?: string;
  sets?: number;
};

export type WorkoutTemplateLineProps = {
  id: Id;
  exerciseId: Id;
  sets: Integer;
  createdAt: Date;
  updatedAt: Date;
};

const setsIntegerOptions = { canBeZero: false, onlyPositive: true };

export class WorkoutTemplateLine {
  private constructor(private readonly props: WorkoutTemplateLineProps) {}

  static create(props: WorkoutTemplateLineCreateProps): WorkoutTemplateLine {
    const entityProps: WorkoutTemplateLineProps = {
      id: Id.create(props.id),
      exerciseId: Id.create(props.exerciseId),
      sets: Integer.create(props.sets, setsIntegerOptions),
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new WorkoutTemplateLine(entityProps);
  }

  update(updateProps: WorkoutTemplateLineUpdateProps) {
    if (updateProps.sets !== undefined) {
      this.props.sets = Integer.create(updateProps.sets, setsIntegerOptions);
    }

    if (updateProps.exerciseId !== undefined) {
      this.props.exerciseId = Id.create(updateProps.exerciseId);
    }

    this.props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get exerciseId() {
    return this.props.exerciseId.value;
  }

  get sets() {
    return this.props.sets.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
