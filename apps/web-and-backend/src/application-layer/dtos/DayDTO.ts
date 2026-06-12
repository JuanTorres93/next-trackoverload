import { DayDTO } from "shared";

import { Day } from "../../domain/entities/day/Day";
import { dayIdToDayMonthYear } from "../../domain/value-objects/DayId/DayId";

export function toDayDTO(day: Day): DayDTO {
  return {
    id: day.id,

    day: day.day,
    month: day.month,
    year: day.year,

    userId: day.userId,

    mealIds: [...day.mealIds],
    fakeMealIds: [...day.fakeMealIds],

    userWeightInKg: day.userWeightInKg,
    updatedCaloriesGoal: day.updatedCaloriesGoal,
    updatedProteinGoal: day.updatedProteinGoal,

    createdAt: day.createdAt.toISOString(),
    updatedAt: day.updatedAt.toISOString(),
  };
}

export function fromDayDTO(dto: DayDTO): Day {
  const day = Day.create({
    ...dayIdToDayMonthYear(dto.id),
    userWeightInKg: dto.userWeightInKg,
    updatedCaloriesGoal: dto.updatedCaloriesGoal,
    userId: dto.userId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    updatedProteinGoal: dto.updatedProteinGoal,
  });

  dto.mealIds.forEach((mealId) => day.addMeal(mealId));
  dto.fakeMealIds.forEach((fakeMealId) => day.addFakeMeal(fakeMealId));

  return day;
}
