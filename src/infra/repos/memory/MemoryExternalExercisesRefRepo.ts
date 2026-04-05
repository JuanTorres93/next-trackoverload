import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";

export class MemoryExternalExercisesRefRepo implements ExternalExercisesRefRepo {
  private repoStorage: ExternalExerciseRef[] = [];

  async getAllExternalExercisesRef(): Promise<ExternalExerciseRef[]> {
    return [...this.repoStorage];
  }

  async getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalExerciseRef | null> {
    const found = this.repoStorage.find(
      (r) => r.externalId === externalId && r.source === source,
    );
    return found || null;
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalExerciseRef[]> {
    return this.repoStorage.filter(
      (r) => externalIds.includes(r.externalId) && r.source === source,
    );
  }

  async save(externalExerciseRef: ExternalExerciseRef): Promise<void> {
    const existingIndex = this.repoStorage.findIndex(
      (r) =>
        r.externalId === externalExerciseRef.externalId &&
        r.source === externalExerciseRef.source,
    );

    if (existingIndex !== -1) {
      this.repoStorage[existingIndex] = externalExerciseRef;
    } else {
      this.repoStorage.push(externalExerciseRef);
    }
  }

  async delete(externalId: string): Promise<void> {
    const initialLength = this.repoStorage.length;
    this.repoStorage = this.repoStorage.filter(
      (r) => r.externalId !== externalId,
    );

    if (this.repoStorage.length === initialLength) {
      return Promise.reject(null);
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.repoStorage = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.repoStorage.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): ExternalExerciseRef[] {
    return [...this.repoStorage];
  }
}
