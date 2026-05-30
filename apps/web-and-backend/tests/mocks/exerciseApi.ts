import { vi } from "vitest";

import { CreateExerciseUsecase } from "@/application-layer/use-cases/exercise/CreateExercise/CreateExercise.usecase";
import { FindExerciseByFuzzyNameUsecase } from "@/application-layer/use-cases/exercise/FindExerciseByFuzzyName/FindExerciseByFuzzyNameUsecase";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import MemoryExerciseFinder from "@/infra/services/ExerciseFinder/MemoryExerciseFinder/MemoryExerciseFinder";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";

import {
  exercisePropsForUseCase,
  mockExercisesForExerciseFinder,
} from "./exercises";

export async function mockExerciseApiFetch() {
  const { findExerciseByFuzzyNameUsecase } = await initializeMockAPI();

  vi.spyOn(global, "fetch").mockImplementation(async (fetchURL) => {
    const url = typeof fetchURL === "string" ? fetchURL : fetchURL.toString();

    if (url.includes("/api/exercise/fuzzy/")) {
      const [path, query] = url.split("/api/exercise/fuzzy/")[1].split("?");

      const term = decodeURIComponent(path);
      const page = parseInt(
        new URLSearchParams(query ?? "").get("page") ?? "1",
        10,
      );

      const data = await findExerciseByFuzzyNameUsecase.execute({
        name: term,
        page,
      });

      return Promise.resolve(
        new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}

async function initializeMockAPI() {
  const mockExercisesRepo = new MemoryExercisesRepo();
  const mockExerciseFinder = new MemoryExerciseFinder(
    mockExercisesForExerciseFinder,
  );

  const createExerciseUsecase = new CreateExerciseUsecase(
    mockExercisesRepo,
    new Uuidv4IdGenerator(),
  );
  const findExerciseByFuzzyNameUsecase = new FindExerciseByFuzzyNameUsecase(
    mockExerciseFinder,
  );

  const promises = exercisePropsForUseCase.map((exercise) =>
    createExerciseUsecase.execute({
      name: exercise.name,
    }),
  );

  await Promise.all(promises);

  return {
    mockExercisesRepo,
    createExerciseUsecase,
    findExerciseByFuzzyNameUsecase,
  };
}
