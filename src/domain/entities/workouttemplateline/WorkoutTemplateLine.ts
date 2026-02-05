import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { Id } from '@/domain/value-objects/Id/Id';
import { Integer } from '@/domain/value-objects/Integer/Integer';

export type WorkoutTemplateLineCreateProps = {
  id: string;
  templateId: string;
  exerciseId: string;
  sets: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkoutTemplateLineUpdateProps = {
  exerciseId?: string;
  sets?: number;
};

export type WorkoutTemplateLineProps = {
  id: Id;
  templateId: Id;
  exerciseId: Id;
  sets: Integer;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

const setsIntegerOptions = { canBeZero: false, onlyPositive: true };

export class WorkoutTemplateLine {
  private constructor(private readonly props: WorkoutTemplateLineProps) {}

  static create(props: WorkoutTemplateLineCreateProps): WorkoutTemplateLine {
    const entityProps: WorkoutTemplateLineProps = {
      id: Id.create(props.id),
      templateId: Id.create(props.templateId),
      exerciseId: Id.create(props.exerciseId),
      sets: Integer.create(props.sets, setsIntegerOptions),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
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

    this.props.updatedAt = DomainDate.create();
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get templateId() {
    return this.props.templateId.value;
  }

  get exerciseId() {
    return this.props.exerciseId.value;
  }

  get sets() {
    return this.props.sets.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
