import { DomainDate } from "@/domain/value-objects/DomainDate/DomainDate";
import { ExternalExerciseRefSource } from "@/domain/value-objects/ExternalExerciseRefSource/ExternalExerciseRefSource";
import { Id } from "@/domain/value-objects/Id/Id";

export type ExternalExerciseRefCreateProps = {
  externalId: string;
  source: string;
  exerciseId: string;
  createdAt?: Date;
};

export type ExternalExerciseRefProps = {
  externalId: Id;
  source: ExternalExerciseRefSource;
  exerciseId: Id;
  createdAt: DomainDate;
};

export class ExternalExerciseRef {
  private constructor(private readonly props: ExternalExerciseRefProps) {}

  static create(props: ExternalExerciseRefCreateProps): ExternalExerciseRef {
    const externalExerciseProps: ExternalExerciseRefProps = {
      externalId: Id.create(props.externalId),
      source: ExternalExerciseRefSource.create(props.source),
      exerciseId: Id.create(props.exerciseId),
      createdAt: DomainDate.create(props.createdAt),
    };

    return new ExternalExerciseRef(externalExerciseProps);
  }

  get externalId() {
    return this.props.externalId.value;
  }

  get source() {
    return this.props.source.value;
  }

  get exerciseId() {
    return this.props.exerciseId.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  toCreateProps(): ExternalExerciseRefCreateProps {
    return {
      externalId: this.props.externalId.value,
      source: this.props.source.value,
      exerciseId: this.props.exerciseId.value,
      createdAt: this.props.createdAt.value,
    };
  }
}
