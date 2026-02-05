import { DomainDate } from '@/domain/value-objects/DomainDate/DomainDate';
import { ExternalIngredientRefSource } from '@/domain/value-objects/ExternalIngredientRefSource/ExternalIngredientRefSource';
import { Id } from '@/domain/value-objects/Id/Id';

export type ExternalIngredientRefCreateProps = {
  externalId: string;
  source: string;
  ingredientId: string;
  createdAt?: Date;
};

export type ExternalIngredientRefProps = {
  externalId: Id;
  source: ExternalIngredientRefSource;
  ingredientId: Id;
  createdAt: DomainDate;
};

export class ExternalIngredientRef {
  private constructor(private readonly props: ExternalIngredientRefProps) {}

  static create(
    props: ExternalIngredientRefCreateProps,
  ): ExternalIngredientRef {
    const externalIngredientProps: ExternalIngredientRefProps = {
      externalId: Id.create(props.externalId),
      source: ExternalIngredientRefSource.create(props.source),
      ingredientId: Id.create(props.ingredientId),
      createdAt: DomainDate.create(props.createdAt),
    };

    return new ExternalIngredientRef(externalIngredientProps);
  }

  get externalId() {
    return this.props.externalId.value;
  }

  get source() {
    return this.props.source.value;
  }

  get ingredientId() {
    return this.props.ingredientId.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  toCreateProps(): ExternalIngredientRefCreateProps {
    return {
      externalId: this.props.externalId.value,
      source: this.props.source.value,
      ingredientId: this.props.ingredientId.value,
      createdAt: this.props.createdAt.value,
    };
  }
}
