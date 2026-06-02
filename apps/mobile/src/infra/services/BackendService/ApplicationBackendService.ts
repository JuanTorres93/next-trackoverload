import { ExerciseDTO, JSENDResponse, UserDTO } from "shared";

import { BackendService } from "@/application-layer/services/BackendService.port";
import { FetchInfraError } from "@/infra/common/infraErrors";

export class ApplicationBackendService implements BackendService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    this.baseUrl = baseUrl;
  }

  // TODO Finish implementation
  async getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseDTO[]>> {
    const response = await fetch(`${this.baseUrl}/exercise/fuzzy/${name}`);

    if (!response.ok) {
      throw new FetchInfraError(
        `Failed to fetch exercise: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("RESPONSE DATA:", data);

    // TODO make a valid implementation
    return data as JSENDResponse<ExerciseDTO[]>;
  }

  async createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, plainPassword, email }),
    });

    if (!response.ok) {
      throw new FetchInfraError(
        `Failed to create user: ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data;
  }
}
