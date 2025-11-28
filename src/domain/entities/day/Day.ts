import { ValidationError } from '../../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../../common/utils';
import {
  validatePositiveNumber,
  validateDate,
  validateNonEmptyString,
} from '../../common/validation';
import { Meal } from '../meal/Meal';
import { Id } from '@/domain/value-objects/Id/Id';
import { FakeMeal } from '../fakemeal/FakeMeal';
import { Protein } from '../../interfaces/Protein';
import { Calories } from '../../interfaces/Calories';

export type DayCreateProps = {
  id: Date;
  userId: string;
  meals: (Meal | FakeMeal)[];
  createdAt: Date;
  updatedAt: Date;
};

export type DayProps = {
  id: Date;
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
  validatePositiveNumber(meal.calories, 'Day meal calories');
  validatePositiveNumber(meal.protein, 'Day meal protein');
}

export class Day implements Protein, Calories {
  private constructor(private readonly props: DayProps) {}

  static create(props: DayCreateProps): Day {
    validateDate(props.id, 'Day id');

    // Validate meals is instance of Meal or FakeMeal
    if (!Array.isArray(props.meals)) {
      throw new ValidationError('Day: meals must be an array');
    }
    for (const meal of props.meals) {
      validateMeal(meal);
    }

    const dayProps: DayProps = {
      id: props.id,
      userId: Id.create(props.userId),
      meals: props.meals,
      createdAt: handleCreatedAt(props.createdAt),
      updatedAt: handleUpdatedAt(props.updatedAt),
    };

    return new Day(dayProps);
  }

  addMeal(meal: Meal | FakeMeal): void {
    validateMeal(meal);

    this.props.meals.push(meal);
    this.props.updatedAt = new Date();
  }

  removeMealById(mealId: string): void {
    // TODO remove when Meal also has Id type for id
    validateNonEmptyString(mealId, 'Day removeMealById mealId');

    const initialLength = this.props.meals.length;

    this.props.meals = this.props.meals.filter((meal) => meal.id !== mealId);

    if (this.props.meals.length === initialLength) {
      throw new ValidationError(`Day: No meal found with id ${mealId}`);
    }
    this.props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId.value;
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
