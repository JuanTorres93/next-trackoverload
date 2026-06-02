import { ExerciseFinderResult, JSENDResponse, UserDTO } from "shared";

export interface BackendService {
  getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>>;

  createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>>;
}
