import { DayId } from '@/domain/value-objects/DayId/DayId';
import { Id } from '@/domain/value-objects/Id/Id';
import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';

export type DayCreateProps = {
  day: number;
  month: number;
  year: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DayProps = {
  id: DayId;
  userId: Id;
  mealIds: Id[];
  fakeMealIds: Id[];
  createdAt: Date;
  updatedAt: Date;
};

export class Day {
  private constructor(private readonly props: DayProps) {}

  static create(props: DayCreateProps): Day {
    const dayProps: DayProps = {
      id: DayId.create({
        day: props.day,
        month: props.month,
        year: props.year,
      }),
      userId: Id.create(props.userId),
      mealIds: [],
      fakeMealIds: [],
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Day(dayProps);
  }

  addMeal(mealId: string): void {
    const validMealId = Id.create(mealId);

    if (this.props.mealIds.find((mealId) => mealId.equals(validMealId))) {
      throw new ValidationError(
        `Day: (Fake)Meal with id ${validMealId} already exists in the day`
      );
    }

    this.props.mealIds.push(validMealId);
    this.props.updatedAt = new Date();
  }

  addFakeMeal(fakeMealId: string): void {
    const validFakeMealId = Id.create(fakeMealId);

    if (
      this.props.fakeMealIds.find((mealId) => mealId.equals(validFakeMealId))
    ) {
      throw new ValidationError(
        `Day: FakeMeal with id ${validFakeMealId} already exists in the day`
      );
    }

    this.props.fakeMealIds.push(validFakeMealId);
    this.props.updatedAt = new Date();
  }

  removeMealById(mealId: string): void {
    const validMealId = Id.create(mealId);
    const initialLength = this.props.mealIds.length;

    this.props.mealIds = this.props.mealIds.filter(
      (mealId) => !mealId.equals(validMealId)
    );

    if (this.props.mealIds.length === initialLength || initialLength === 0) {
      throw new ValidationError(`Day: No meal found with id ${mealId}`);
    }
    this.props.updatedAt = new Date();
  }

  removeFakeMealById(fakeMealId: string): void {
    const validFakeMealId = Id.create(fakeMealId);
    const initialLength = this.props.fakeMealIds.length;

    this.props.fakeMealIds = this.props.fakeMealIds.filter(
      (mealId) => !mealId.equals(validFakeMealId)
    );

    if (
      this.props.fakeMealIds.length === initialLength ||
      initialLength === 0
    ) {
      throw new ValidationError(
        `Day: No fake meal found with id ${fakeMealId}`
      );
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

  get day() {
    return this.props.id.day;
  }

  get month() {
    return this.props.id.month;
  }

  get year() {
    return this.props.id.year;
  }

  get mealIds() {
    return this.props.mealIds?.map((id) => id.value);
  }

  get fakeMealIds() {
    return this.props.fakeMealIds?.map((id) => id.value);
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
