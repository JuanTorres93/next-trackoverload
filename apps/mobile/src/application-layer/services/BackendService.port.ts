export interface BackendService {
  getExerciseByFuzzyName(name: string): Promise<void>;
}
