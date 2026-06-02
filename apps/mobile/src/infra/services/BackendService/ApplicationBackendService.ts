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

  async getExerciseByFuzzyName(name: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/exercise/fuzzy/${name}`);

    if (!response.ok) {
      throw new FetchInfraError(
        `Failed to fetch exercise: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("RESPONSE DATA:", data);
  }
}
