import { DayId } from '@/domain/value-objects/DayId/DayId';
import { Id } from '@/domain/value-objects/Id/Id';
import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import { Calories } from '../../interfaces/Calories';
import { Protein } from '../../interfaces/Protein';
import { FakeMeal } from '../fakemeal/FakeMeal';
import { Meal } from '../meal/Meal';

export type DayCreateProps = {
  day: number;
  month: number;
  year: number;
  userId: string;
  meals: (Meal | FakeMeal)[];
  createdAt: Date;
  updatedAt: Date;
};

export type DayProps = {
  id: DayId;
  userId: Id;
  meals: (Meal | FakeMeal)[];
  createdAt: Date;
  updatedAt: Date;
};

function validateMeal(meal: Meal | FakeMeal) {
  if (!(meal instanceof Meal) && !(meal instanceof FakeMeal)) {
    throw new ValidationError(
      'Day: meal must be an instance of Meal or FakeMeal'
    );
  }
}

export class Day implements Protein, Calories {
  private constructor(private readonly props: DayProps) {}

  static create(props: DayCreateProps): Day {
    // Validate meals is instance of Meal or FakeMeal
    if (!Array.isArray(props.meals)) {
      throw new ValidationError('Day: meals must be an array');
    }
    for (const meal of props.meals) {
      validateMeal(meal);
    }

    const dayProps: DayProps = {
      id: DayId.create({
        day: props.day,
        month: props.month,
        year: props.year,
      }),
      userId: Id.create(props.userId),
      meals: props.meals,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Day(dayProps);
  }

  addMeal(meal: Meal | FakeMeal): void {
    validateMeal(meal);

    if (this.props.meals.find((m) => m.id === meal.id)) {
      throw new ValidationError(
        `Day: (Fake)Meal with id ${meal.id} already exists in the day`
      );
    }

    this.props.meals.push(meal);
    this.props.updatedAt = new Date();
  }

  removeMealById(mealId: string): void {
    const initialLength = this.props.meals.length;

    this.props.meals = this.props.meals.filter((meal) => meal.id !== mealId);

    if (this.props.meals.length === initialLength || initialLength === 0) {
      throw new ValidationError(`Day: No meal found with id ${mealId}`);
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

  get meals() {
    return [...this.props.meals];
  }

  get calories() {
    return this.props.meals.reduce((total, meal) => total + meal.calories, 0);
  }

  get protein() {
    return this.props.meals.reduce((total, meal) => total + meal.protein, 0);
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
