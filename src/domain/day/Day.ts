import { ValidationError } from '../common/errors';
import { handleCreatedAt, handleUpdatedAt } from '../common/utils';
import { validatePositiveNumber, validateDate } from '../common/validation';
import { Meal } from '../meal/Meal';
import { FakeMeal } from '../fakemeal/FakeMeal';
import { Protein } from '../interfaces/Protein';
import { Calories } from '../interfaces/Calories';

export type DayProps = {
  id: Date;
  meals: (Meal | FakeMeal)[];
  createdAt: Date;
  updatedAt: Date;
};

export class Day implements Protein, Calories {
  private constructor(private readonly props: DayProps) {}

  static create(props: DayProps): Day {
    // Validation
    validateDate(props.id, 'Day id');
    props.createdAt = handleCreatedAt(props.createdAt);
    props.updatedAt = handleUpdatedAt(props.updatedAt);

    return new Day(props);
  }

  addMeal(meal: Meal | FakeMeal): void {
    validatePositiveNumber(meal.calories, 'Day meal calories');
    validatePositiveNumber(meal.protein, 'Day meal protein');

    this.props.meals.push(meal);
    this.props.updatedAt = new Date();
  }

  removeMealById(mealId: string): void {
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
