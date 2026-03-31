import * as dto from "@/../tests/dtoProperties";
import { FakeMeal } from "@/domain/entities/fakemeal/FakeMeal";
import { Meal } from "@/domain/entities/meal/Meal";

import * as dayTestProps from "../../../../tests/createProps/dayTestProps";
import { toAssembledDayDTO } from "../AssembledDayDTO";

describe("AssembledDayDTO", () => {
  let assembledDayDTO: ReturnType<typeof toAssembledDayDTO>;
  let meal: Meal;
  let fakeMeal: FakeMeal;

  beforeEach(() => {
    ({ assembledDayDTO, meal, fakeMeal } =
      dayTestProps.getValidAssembledDayDTO());
  });

  it("should have a prop for each assembled day getter", () => {
    for (const getter of dto.assembledDayDTOProperties) {
      expect(assembledDayDTO).toHaveProperty(getter);
    }
  });

  it("should contain all base day properties", () => {
    for (const getter of dto.dayDTOProperties) {
      expect(assembledDayDTO).toHaveProperty(getter);
    }
  });

  it("should have meals as an array of MealDTOs", () => {
    expect(assembledDayDTO.meals).toHaveLength(1);
    for (const getter of dto.mealDTOProperties) {
      expect(assembledDayDTO.meals[0]).toHaveProperty(getter);
    }
  });

  it("should have fakeMeals as an array of FakeMealDTOs", () => {
    expect(assembledDayDTO.fakeMeals).toHaveLength(1);
    for (const getter of dto.fakeMealDTOProperties) {
      expect(assembledDayDTO.fakeMeals[0]).toHaveProperty(getter);
    }
  });

  it("should reflect meal data correctly", () => {
    expect(assembledDayDTO.meals[0].id).toBe(meal.id);
  });

  it("should reflect fakeMeal data correctly", () => {
    expect(assembledDayDTO.fakeMeals[0].id).toBe(fakeMeal.id);
  });

  it("should know if is today", async () => {
    const today = new Date();
    const todayAssembledDayDTO = toAssembledDayDTO({
      ...assembledDayDTO,
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });

    expect(todayAssembledDayDTO.isToday).toBe(true);
  });

  it("should know it is not today", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayAssembledDayDTO = toAssembledDayDTO({
      ...assembledDayDTO,
      day: yesterday.getDate(),
      month: yesterday.getMonth() + 1,
      year: yesterday.getFullYear(),
    });

    expect(yesterdayAssembledDayDTO.isToday).toBe(false);
  });

  it("should know it is in the past", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayAssembledDayDTO = toAssembledDayDTO({
      ...assembledDayDTO,
      day: yesterday.getDate(),
      month: yesterday.getMonth() + 1,
      year: yesterday.getFullYear(),
    });

    expect(yesterdayAssembledDayDTO.isToday).toBe(false);
    expect(yesterdayAssembledDayDTO.isPast).toBe(true);
  });

  describe("totalCalories", () => {
    it("should sum calories from meals and fakeMeals", () => {
      const expected = meal.calories + fakeMeal.calories;
      expect(assembledDayDTO.totalCalories).toBe(expected);
    });

    it("should return 0 when there are no meals or fakeMeals", () => {
      const emptyDay = toAssembledDayDTO({
        ...assembledDayDTO,
        meals: [],
        fakeMeals: [],
      });
      expect(emptyDay.totalCalories).toBe(0);
    });
  });

  describe("totalProtein", () => {
    it("should sum protein from meals and fakeMeals", () => {
      const expected = meal.protein + fakeMeal.protein;
      expect(assembledDayDTO.totalProtein).toBe(expected);
    });

    it("should return 0 when there are no meals or fakeMeals", () => {
      const emptyDay = toAssembledDayDTO({
        ...assembledDayDTO,
        meals: [],
        fakeMeals: [],
      });
      expect(emptyDay.totalProtein).toBe(0);
    });
  });
});
