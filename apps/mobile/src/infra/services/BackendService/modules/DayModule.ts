import { DayDTO } from "shared";
import { JSENDResponse } from "shared/src/infra/types/JSEND";

export class DayModule {
  constructor(private baseUrl: string) {}

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
}
