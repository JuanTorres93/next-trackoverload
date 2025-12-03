import { Day } from '@/domain/entities/day/Day';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';

export type DayDTO = {
  id: string; // Date as YYYYMMDD
  userId: string;
  mealIds: string[];
  fakeMealIds: string[];
  createdAt: string;
  day: number;
  month: number;
  year: number;
  updatedAt: string;
};

export function toDayDTO(day: Day): DayDTO {
  return {
    id: day.id,
    userId: day.userId,
    mealIds: [...day.mealIds],
    fakeMealIds: [...day.fakeMealIds],
    day: day.day,
    month: day.month,
    year: day.year,
    createdAt: day.createdAt.toISOString(),
    updatedAt: day.updatedAt.toISOString(),
  };
}

export function fromDayDTO(dto: DayDTO): Day {
  const day = Day.create({
    ...dayIdToDayMonthYear(dto.id),
    userId: dto.userId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });

  dto.mealIds.forEach((mealId) => day.addMeal(mealId));
  dto.fakeMealIds.forEach((fakeMealId) => day.addFakeMeal(fakeMealId));

  return day;
}
