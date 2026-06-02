import { ExerciseDTO, JSENDResponse } from "shared";

export interface BackendService {
  getExerciseByFuzzyName(name: string): Promise<JSENDResponse<ExerciseDTO[]>>;

  createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<string>>;
}
