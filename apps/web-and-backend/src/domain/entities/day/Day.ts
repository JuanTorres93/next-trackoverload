import { logNoTest } from "@/utils/logNoTest";

import { ValidationError } from "../../common/errors";
import { DayId } from "../../value-objects/DayId/DayId";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Id } from "../../value-objects/Id/Id";
import { Integer } from "../../value-objects/Integer/Integer";
import { WeightInKg } from "../../value-objects/WeightInKg/WeightInKg";

export type DayCreateProps = {
  day: number;
  month: number;
  year: number;

  userId: string;

  userWeightInKg?: number;
  updatedCaloriesGoal?: number;
  updatedProteinGoal?: number;

  createdAt?: Date;
  updatedAt?: Date;
};

export type DayProps = {
  id: DayId;
  userId: Id;

  mealIds: Id[];
  fakeMealIds: Id[];

  userWeightInKg?: WeightInKg;
  updatedCaloriesGoal?: Integer;
  updatedProteinGoal?: Integer;

  createdAt: DomainDate;
  updatedAt: DomainDate;
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

      userWeightInKg: props.userWeightInKg
        ? WeightInKg.create(props.userWeightInKg)
        : undefined,
      updatedCaloriesGoal: props.updatedCaloriesGoal
        ? Integer.create(props.updatedCaloriesGoal)
        : undefined,
      updatedProteinGoal: props.updatedProteinGoal
        ? Integer.create(props.updatedProteinGoal)
        : undefined,

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Day(dayProps);
  }

  addMeal(mealId: string): void {
    const validMealId = Id.create(mealId);

    if (this.props.mealIds.find((mealId) => mealId.equals(validMealId))) {
      logNoTest(
        `Day: (Fake)Meal with id ${validMealId} already exists in the day`,
      );
      throw new ValidationError("La comida ya existe en el día.");
    }

    this.props.mealIds.push(validMealId);
    this.props.updatedAt = DomainDate.create(new Date());
  }

  addFakeMeal(fakeMealId: string): void {
    const validFakeMealId = Id.create(fakeMealId);

    if (
      this.props.fakeMealIds.find((mealId) => mealId.equals(validFakeMealId))
    ) {
      logNoTest(
        `Day: FakeMeal with id ${validFakeMealId} already exists in the day`,
      );
      throw new ValidationError("La comida rápida ya existe en el día.");
    }

    this.props.fakeMealIds.push(validFakeMealId);
    this.props.updatedAt = DomainDate.create(new Date());
  }

  removeMealById(mealId: string): void {
    const validMealId = Id.create(mealId);
    const initialLength = this.props.mealIds.length;

    this.props.mealIds = this.props.mealIds.filter(
      (mealId) => !mealId.equals(validMealId),
    );

    if (this.props.mealIds.length === initialLength || initialLength === 0) {
      logNoTest(`Day: No meal found with id ${mealId}`);
      throw new ValidationError("La comida no existe en el día.");
    }
    this.props.updatedAt = DomainDate.create(new Date());
  }

  removeFakeMealById(fakeMealId: string): void {
    const validFakeMealId = Id.create(fakeMealId);

    const fakeMealExists = this.props.fakeMealIds.find((mealId) =>
      mealId.equals(validFakeMealId),
    );

    if (!fakeMealExists) {
      logNoTest(`Day: No fake meal found with id ${fakeMealId}`);
      throw new ValidationError("La comida rápida no existe en el día.");
    }

    this.props.fakeMealIds = this.props.fakeMealIds.filter(
      (mealId) => !mealId.equals(validFakeMealId),
    );

    this.props.updatedAt = DomainDate.create(new Date());
  }

  updateUserWeightInKg(newWeightInKg: number): void {
    this.props.userWeightInKg = WeightInKg.create(newWeightInKg);

    this.props.updatedAt = DomainDate.create(new Date());
  }

  updateCaloriesGoal(newCaloriesGoal: number): void {
    this.props.updatedCaloriesGoal = Integer.create(newCaloriesGoal);

    this.props.updatedAt = DomainDate.create(new Date());
  }

  toCreateProps(): DayCreateProps {
    return {
      day: this.day,
      month: this.month,
      year: this.year,

      userId: this.userId,

      userWeightInKg: this.userWeightInKg,
      updatedCaloriesGoal: this.updatedCaloriesGoal,
      updatedProteinGoal: this.updatedProteinGoal,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
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

  get userWeightInKg() {
    return this.props.userWeightInKg?.value;
  }

  get updatedCaloriesGoal() {
    return this.props.updatedCaloriesGoal?.value;
  }

  get updatedProteinGoal() {
    return this.props.updatedProteinGoal?.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
