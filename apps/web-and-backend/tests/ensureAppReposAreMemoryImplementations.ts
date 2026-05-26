import { readdirSync } from "fs";
import { join } from "path";

import { MemoryDaysRepo } from "../src/infra/repos/memory/MemoryDaysRepo";
import { MemoryExercisesRepo } from "../src/infra/repos/memory/MemoryExercisesRepo";
import { MemoryExternalExercisesRefRepo } from "../src/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MemoryExternalIngredientsRefRepo } from "../src/infra/repos/memory/MemoryExternalIngredientsRefRepo";
import { MemoryFakeMealsRepo } from "../src/infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryImagesRepo } from "../src/infra/repos/memory/MemoryImagesRepo";
import { MemoryIngredientsRepo } from "../src/infra/repos/memory/MemoryIngredientsRepo";
import { MemoryMealsRepo } from "../src/infra/repos/memory/MemoryMealsRepo";
import { MemoryRecipesRepo } from "../src/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "../src/infra/repos/memory/MemoryUsersRepo";
import { MemoryWorkoutTemplatesRepo } from "../src/infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { MemoryWorkoutsRepo } from "../src/infra/repos/memory/MemoryWorkoutsRepo";
import { AppDaysRepo } from "../src/interface-adapters/app/repos/AppDaysRepo";
import { AppExercisesRepo } from "../src/interface-adapters/app/repos/AppExercisesRepo";
import { AppExternalExercisesRefRepo } from "../src/interface-adapters/app/repos/AppExternalExercisesRefRepo";
import { AppExternalIngredientsRefRepo } from "../src/interface-adapters/app/repos/AppExternalIngredientsRefRepo";
import { AppFakeMealsRepo } from "../src/interface-adapters/app/repos/AppFakeMealsRepo";
import { AppImagesRepo } from "../src/interface-adapters/app/repos/AppImagesRepo";
import { AppIngredientsRepo } from "../src/interface-adapters/app/repos/AppIngredientsRepo";
import { AppMealsRepo } from "../src/interface-adapters/app/repos/AppMealsRepo";
import { AppRecipesRepo } from "../src/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "../src/interface-adapters/app/repos/AppUsersRepo";
import { AppWorkoutsRepo } from "../src/interface-adapters/app/repos/AppWorkoutsRepo";
import { AppWorkoutsTemplatesRepo } from "../src/interface-adapters/app/repos/AppWorkoutsTemplatesRepo";

const appRepos = [
  {
    appRepo: AppDaysRepo,
    memoryRepo: MemoryDaysRepo,
  },
  {
    appRepo: AppExercisesRepo,
    memoryRepo: MemoryExercisesRepo,
  },
  {
    appRepo: AppExternalExercisesRefRepo,
    memoryRepo: MemoryExternalExercisesRefRepo,
  },
  {
    appRepo: AppExternalIngredientsRefRepo,
    memoryRepo: MemoryExternalIngredientsRefRepo,
  },
  {
    appRepo: AppFakeMealsRepo,
    memoryRepo: MemoryFakeMealsRepo,
  },
  {
    appRepo: AppImagesRepo,
    memoryRepo: MemoryImagesRepo,
  },
  {
    appRepo: AppIngredientsRepo,
    memoryRepo: MemoryIngredientsRepo,
  },
  {
    appRepo: AppMealsRepo,
    memoryRepo: MemoryMealsRepo,
  },
  {
    appRepo: AppRecipesRepo,
    memoryRepo: MemoryRecipesRepo,
  },
  {
    appRepo: AppUsersRepo,
    memoryRepo: MemoryUsersRepo,
  },
  {
    appRepo: AppWorkoutsRepo,
    memoryRepo: MemoryWorkoutsRepo,
  },
  {
    appRepo: AppWorkoutsTemplatesRepo,
    memoryRepo: MemoryWorkoutTemplatesRepo,
  },
];

assertAllReposHaveAdapters();

appRepos.forEach(({ appRepo, memoryRepo }) => {
  assertIsMemoryRepo(appRepo, memoryRepo);
});

function assertIsMemoryRepo(
  appRepo: unknown,
  memoryRepo: new (...args: unknown[]) => unknown,
): void {
  if (!(appRepo instanceof memoryRepo)) {
    throw new Error(
      "TESTS GLOBAL SETUP: Expected appRepo to be an instance of the corresponding MemoryRepo",
    );
  }
}

function assertAllReposHaveAdapters(): void {
  const repoAdaptersDir = join(
    __dirname,
    "../src/interface-adapters/app/repos",
  );
  const testReposDir = join(__dirname, "./repos");

  const repoAdapterFiles = readdirSync(repoAdaptersDir).filter((f) =>
    f.endsWith(".ts"),
  );
  const testReposFiles = readdirSync(testReposDir).filter((f) =>
    f.endsWith(".ts"),
  );

  if (repoAdapterFiles.length !== appRepos.length) {
    throw new Error(
      `TESTS GLOBAL SETUP: Mismatch: found ${repoAdapterFiles.length} repo adapters but ${appRepos.length} are registered in tests/setup.ts`,
    );
  }

  if (testReposFiles.length !== appRepos.length) {
    throw new Error(
      `TESTS GLOBAL SETUP: Mismatch: found ${testReposFiles.length} test repos but ${appRepos.length} are registered in tests/setup.ts`,
    );
  }
}
