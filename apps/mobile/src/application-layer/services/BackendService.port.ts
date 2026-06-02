export interface BackendService {
  // TODO NEXT: create share package and share DTOs and JSEND
  getExerciseByFuzzyName(name: string): Promise<void>;
}
