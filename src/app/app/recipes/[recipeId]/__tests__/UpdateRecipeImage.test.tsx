import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { createMockRecipes } from "@/../tests/mocks/recipes";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import { createTestImage } from "../../../../../../tests/helpers/imageTestHelpers";
import UpdateRecipeImage from "../UpdateRecipeImage";

// Mock AppClientImageProcessor to avoid browser API incompatibilities in the test environment
vi.mock("@/interface-adapters/app/services/AppClientImageProcessor", () => ({
  AppClientImageProcessor: {
    compressToMaxMB: vi.fn((file: File) => Promise.resolve(file)),
  },
}));

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let recipe: RecipeDTO;

async function setup() {
  const { mockRecipes } = await createMockRecipes();
  recipe = mockRecipes[0];

  render(<UpdateRecipeImage recipe={recipe} />);

  return { recipe };
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe("UpdateRecipeImage", () => {
  it("updates recipe image when no previous image existed", async () => {
    await setup();

    const updateImageInput = screen.getByTestId(
      "edit-recipe-image-button",
    ) as HTMLInputElement;

    const testImage = await createTestImage("small");

    const testImageFile = new File(
      [new Uint8Array(testImage)],
      "test-image.png",
      {
        type: "image/png",
      },
    );

    // Mock arrayBuffer method for Node.js environment
    testImageFile.arrayBuffer = async () => {
      const uint8Array = new Uint8Array(testImage);
      return uint8Array.buffer as ArrayBuffer;
    };

    expect(recipe.imageUrl).toBeUndefined();

    await userEvent.upload(updateImageInput, testImageFile);

    await waitFor(async () => {
      const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);

      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.imageUrl).toBeDefined();
    });
  });
});
