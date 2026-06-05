import { DayDTO, DayEntry } from "shared";
import { JSENDResponse } from "shared/src/infra/types/JSEND";

export class DayModule {
  constructor(private baseUrl: string) {}

  // CREATE
  async createDay(
    day: number,
    month: number,
    year: number,
    userId: string,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(`${this.baseUrl}/day`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day,
        month,
        year,
        targetUserId: userId,
      }),
    });

    return response.json();
  }

  async addMultipleMealsToMultipleDays(
    recipeIds: string[],
    dayIds: string[],
    userId: string,
  ): Promise<JSENDResponse<DayDTO[]>> {
    const response = await fetch(`${this.baseUrl}/day/meal/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeIds,
        dayIds,
        targetUserId: userId,
      }),
    });

    return response.json();
  }

  async getLastDayWithCaloriesGoal(): Promise<JSENDResponse<DayDTO | null>> {
    const response = await fetch(`${this.baseUrl}/day/last/calories`);

    return response.json();
  }

  async getLastNumberOfDays(
    numberOfDays: number,
  ): Promise<JSENDResponse<DayEntry[]>> {
    const response = await fetch(`${this.baseUrl}/day/last/${numberOfDays}`);

    return response.json();
  }

  async setCaloriesGoalForDayAndUser(
    dayId: string,
    userId: string,
    newCaloriesGoal: number,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(`${this.baseUrl}/day/${dayId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newCaloriesGoal, targetUserId: userId }),
    });

    return response.json();
  }

  async updateUserWeightForDay(
    dayId: string,
    userId: string,
    newWeightInKg: number,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(`${this.baseUrl}/day/${dayId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newWeightInKg, targetUserId: userId }),
    });

    return response.json();
  }

  async addMultipleMealsToDay(
    dayId: string,
    recipeIds: string[],
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(`${this.baseUrl}/day/${dayId}/meal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeIds }),
    });

    return response.json();
  }

  async removeMealFromDay(
    dayId: string,
    mealId: string,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(
      `${this.baseUrl}/day/${dayId}/meal/${mealId}`,
      {
        method: "DELETE",
      },
    );

    return response.json();
  }

  async addFakeMealToDay(
    dayId: string,
    name: string,
    calories: number,
    protein: number,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(`${this.baseUrl}/day/${dayId}/fakemeal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, calories, protein }),
    });

    return response.json();
  }

  async removeFakeMealFromDay(
    dayId: string,
    fakeMealId: string,
  ): Promise<JSENDResponse<DayDTO>> {
    const response = await fetch(
      `${this.baseUrl}/day/${dayId}/fakemeal/${fakeMealId}`,
      {
        method: "DELETE",
      },
    );

    return response.json();
  }

  async getAssembledDayById(
    dayId: string,
  ): Promise<JSENDResponse<import("shared").AssembledDayDTO | null>> {
    const response = await fetch(`${this.baseUrl}/day/assembled/${dayId}`);

    return response.json();
  }
}
