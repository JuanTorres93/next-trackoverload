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
}
