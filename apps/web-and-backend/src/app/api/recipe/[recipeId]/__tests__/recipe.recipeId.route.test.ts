import type { NextRequest } from "next/server";

import * as recipeTestProps from "../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { createTestImage } from "../../../../../../tests/helpers/imageTestHelpers";
import { TestExternalIngredientsRefRepo } from "../../../../../../tests/repos/TestExternalIngredientsRefRepo";
import { TestImagesRepo } from "../../../../../../tests/repos/TestImagesRepo";
import { TestIngredientsRepo } from "../../../../../../tests/repos/TestIngredientsRepo";
import { TestRecipesRepo } from "../../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../../tests/repos/TestUsersRepo";
import { Recipe } from "../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { DELETE, POST, PUT } from "../route";

describe("POST /api/recipe/[recipeId]", () => {
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  beforeEach(async () => {
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
    TestIngredientsRepo.clearForTesting();
    TestExternalIngredientsRefRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await TestRecipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  const validIngredientBody = {
    externalIngredientId: "ext-id-1",
    source: "openfoodfacts",
    name: "Chicken Breast",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    quantityInGrams: 200,
  };

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validIngredientBody),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validIngredientBody),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should add ingredient to recipe", async () => {
    await loginInAPITests(user1.email);

    const initialCount = testRecipe.ingredientLines.length;

    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validIngredientBody),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testRecipe.id);
    expect(data.data.ingredientLines.length).toBe(initialCount + 1);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validIngredientBody),
        }) as NextRequest,
        { params: Promise.resolve({ recipeId: testRecipe.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await POST(
        new Request("http://localhost/api/recipe/non-existent-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validIngredientBody),
        }) as NextRequest,
        { params: Promise.resolve({ recipeId: "non-existent-recipe" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});

describe("DELETE /api/recipe/[recipeId]", () => {
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  beforeEach(async () => {
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await TestRecipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await DELETE(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await DELETE(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should delete the recipe", async () => {
    await loginInAPITests(user1.email);

    const response = await DELETE(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeNull();

    const deleted = await TestRecipesRepo.getRecipeByIdAndUserId(
      testRecipe.id,
      user1Id,
    );
    expect(deleted).toBeNull();
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await DELETE(
        new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
          method: "DELETE",
        }),
        { params: Promise.resolve({ recipeId: testRecipe.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await DELETE(
        new Request("http://localhost/api/recipe/non-existent-recipe", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ recipeId: "non-existent-recipe" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});

describe("PUT /api/recipe/[recipeId]", () => {
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    testImageBuffer = await createTestImage("small");
  });

  beforeEach(async () => {
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
    TestImagesRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await TestRecipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await PUT(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should update recipe name", async () => {
    await loginInAPITests(user1.email);

    const newName = "New Recipe Name";

    const response = await PUT(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testRecipe.id);
    expect(data.data).toHaveProperty("name", newName);
  });

  it("should update recipe image when imageData is provided", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: testImageBuffer }),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testRecipe.id);
    expect(data.data.imageUrl).toBeDefined();
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(`http://localhost/api/recipe/${testRecipe.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Updated Name" }),
        }) as NextRequest,
        { params: Promise.resolve({ recipeId: testRecipe.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await PUT(
        new Request("http://localhost/api/recipe/non-existent-recipe", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Updated Name" }),
        }) as NextRequest,
        { params: Promise.resolve({ recipeId: "non-existent-recipe" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
