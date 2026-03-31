import * as dto from "@/../tests/dtoProperties";
import { FakeMeal } from "@/domain/entities/fakemeal/FakeMeal";
import { Meal } from "@/domain/entities/meal/Meal";

import * as dayTestProps from "../../../../tests/createProps/dayTestProps";
import { AssembledDayDTO } from "../AssembledDayDTO";

describe("AssembledDayDTO", () => {
  let assembledDayDTO: AssembledDayDTO;
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
});
