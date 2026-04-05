import { beforeEach, describe, expect, it } from "vitest";

import { Exercise } from "@/domain/entities/exercise/Exercise";

import * as exerciseTestProps from "../../../../../tests/createProps/exerciseTestProps";
import { MemoryExercisesRepo } from "../MemoryExercisesRepo";

describe("MemoryExercisesRepo", () => {
  let repo: MemoryExercisesRepo;
  let exercise: Exercise;

  beforeEach(async () => {
    repo = new MemoryExercisesRepo();
    exercise = exerciseTestProps.createTestExercise();

    await repo.saveExercise(exercise);
  });

  it("should save an exercise", async () => {
    const newExercise = Exercise.create({
      id: "2",
      name: "Squat",
      createdAt: new Date("2023-01-02"),
      updatedAt: new Date("2023-01-02"),
    });
    await repo.saveExercise(newExercise);

    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(2);
    expect(allExercises[1].name).toBe("Squat");
  });

  it("should retrieve an exercise by ID", async () => {
    const fetchedExercise = await repo.getExerciseById(exercise.id);
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe(exercise.name);
  });

  it("should update an existing exercise", async () => {
    const updatedExercise = exerciseTestProps.createTestExercise({
      name: "Updated Push Up",
    });
    await repo.saveExercise(updatedExercise);

    const fetchedExercise = await repo.getExerciseById(exercise.id);
    expect(fetchedExercise).not.toBeNull();
    expect(fetchedExercise?.name).toBe("Updated Push Up");
  });

  it("should return null for non-existent exercise ID", async () => {
    const fetchedExercise = await repo.getExerciseById("non-existent-id");
    expect(fetchedExercise).toBeNull();
  });

  it("should delete an exercise by ID", async () => {
    const allExercises = await repo.getAllExercises();
    expect(allExercises.length).toBe(1);

    await repo.deleteExercise(exercise.id);

    const allExercisesAfterDeletion = await repo.getAllExercises();
    expect(allExercisesAfterDeletion.length).toBe(0);
  });

  describe("getExercisesByIds", () => {
    it("should return exercises matching the given ids", async () => {
      const exercise2 = exerciseTestProps.createTestExercise({
        id: "ex2",
        name: "Squat",
      });
      const exercise3 = exerciseTestProps.createTestExercise({
        id: "ex3",
        name: "Deadlift",
      });
      await repo.saveExercise(exercise2);
      await repo.saveExercise(exercise3);

      const result = await repo.getExercisesByIds([exercise.id, "ex3"]);

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toContain(exercise.id);
      expect(result.map((e) => e.id)).toContain("ex3");
    });

    it("should return empty array when no ids match", async () => {
      const result = await repo.getExercisesByIds([
        "non-existent-1",
        "non-existent-2",
      ]);
      expect(result).toEqual([]);
    });

    it("should return empty array for empty ids array", async () => {
      const result = await repo.getExercisesByIds([]);
      expect(result).toEqual([]);
    });

    it("should ignore ids that do not exist", async () => {
      const result = await repo.getExercisesByIds([
        exercise.id,
        "non-existent",
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(exercise.id);
    });
  });
});
