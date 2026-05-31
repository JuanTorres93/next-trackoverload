import { vi } from "vitest";

import { CreateIngredientUsecase } from "@/application-layer/use-cases/ingredient/CreateIngredient/CreateIngredient.usecase";
import { FindIngredientByFuzzyNameUsecase } from "@/application-layer/use-cases/ingredient/FindIngredientByFuzzyName/FindIngredientByFuzzyNameUsecase";
import { MemoryIngredientsRepo } from "@/infra/repos/memory/MemoryIngredientsRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";
import MemoryIngredientFinder from "@/infra/services/IngredientsFinder/MemoryIngredientFinder/MemoryIngredientFinder";

import { IngredientFinderResult } from "../../src/domain/services/IngredientFinder.port";
import {
  ingredientPropsForUseCase,
  mockIngredientsForIngredientFinder,
} from "./ingredients";

export const DEFAULT_BARCODE_INGREDIENT: IngredientFinderResult = {
  ingredient: {
    name: "Avena Integral",
    nutritionalInfoPer100g: { calories: 370, protein: 13 },
    imageUrl: undefined,
    category: "other",
  },
  externalRef: { externalId: "8414807558305", source: "openfoodfacts" },
};

export async function mockIngredientApiFetch(options?: {
  barcodeIngredient?: IngredientFinderResult;
  fuzzyResolver?: FuzzyResolver;
}) {
  await initializeMockAPI();

  const barcodeIngredient =
    options?.barcodeIngredient ?? DEFAULT_BARCODE_INGREDIENT;

  const fuzzyResolver = options?.fuzzyResolver ?? lowercaseFuzzyResolver;

  vi.spyOn(global, "fetch").mockImplementation((input) => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.includes("/api/ingredient/fuzzy/")) {
      const [path, query] = url.split("/api/ingredient/fuzzy/")[1].split("?");

      const term = decodeURIComponent(path);
      const page = parseInt(
        new URLSearchParams(query ?? "").get("page") ?? "1",
        10,
      );

      const data = fuzzyResolver(term, page);

      return Promise.resolve(
        new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (url.includes("/api/ingredient/barcode/")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({ status: "success", data: [barcodeIngredient] }),
          { headers: { "Content-Type": "application/json" } },
        ),
      );
    }

    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}

type FuzzyResolver = (term: string, page: number) => IngredientFinderResult[];

function lowercaseFuzzyResolver(term: string): IngredientFinderResult[] {
  return mockIngredientsForIngredientFinder.filter((ingredient) =>
    ingredient.ingredient.name.toLowerCase().includes(term.toLowerCase()),
  );
}

async function initializeMockAPI() {
  const mockIngredientsRepo = new MemoryIngredientsRepo();
  const mockIngredientFinder = new MemoryIngredientFinder(
    mockIngredientsForIngredientFinder,
  );

  const createIngredientUsecase = new CreateIngredientUsecase(
    mockIngredientsRepo,
    new Uuidv4IdGenerator(),
  );
  const findIngredientByFuzzyNameUsecase = new FindIngredientByFuzzyNameUsecase(
    mockIngredientFinder,
  );

  const promises = ingredientPropsForUseCase.map((ingredient) =>
    createIngredientUsecase.execute(ingredient),
  );

  await Promise.all(promises);

  return {
    mockIngredientsRepo,
    createIngredientUsecase,
    findIngredientByFuzzyNameUsecase,
  };
}
