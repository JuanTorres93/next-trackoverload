import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Recipe } from "@/domain/entities/recipe/Recipe";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as recipeTestProps from "../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { GET } from "../route";

describe("GET /api/recipe/[userId]", () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let testRecipes: Recipe[];
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();

    const user1 = userTestProps.createTestUser();

    const user2 = userTestProps.createTestUser({
      email: "user2@example.com",
    });

    await registerUserInAPITests(user1.email, user1.name);

    await registerUserInAPITests(user2.email, user2.name);

    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;
    user2Id = (await usersRepo.getUserByEmail(user2.email))!.id;

    testRecipes = [
      recipeTestProps.createTestRecipe(
        {
          userId: user1Id,
        },
        1,
      ),
      recipeTestProps.createTestRecipe(
        {
          id: "recipe2",
          userId: user1Id,
        },
        2,
      ),
    ];

    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }
  });

  it("returns JSEND format", async () => {
    const params = Promise.resolve({ userId: user1Id });

    const response = await GET(
      new Request(`http://localhost/api/recipe/${user1Id}`),
      { params: { userId: user1Id } },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("returns all recipes for a user", async () => {
    const response = await GET(
      new Request(`http://localhost/api/recipe/${user1Id}`),
      { params: { userId: user1Id } },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
  });

  describe("Errors", () => {
    it("should return 404 if user does not exist", async () => {
      const nonExistentUserId = "non-existent-user";

      const response = await GET(
        new Request(`http://localhost/api/recipe/${nonExistentUserId}`),
        { params: { userId: nonExistentUserId } },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    // TODO NEXT: auth in tests

    //it("should return 404 if user does not have permission to view recipes", async () => {
    //  const response = await GET(
    //    new Request(`http://localhost/api/recipe/${userId2}`),
    //    { params: { userId: userId2 } },
    //  );

    //  const data = await response.json();

    //  expect(response.status).toBe(404);
    //  expect(data).toHaveProperty("status", "fail");
    //  expect(data.data).toHaveProperty("message");
    //});
  });
});
