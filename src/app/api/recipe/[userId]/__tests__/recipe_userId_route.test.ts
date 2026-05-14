import { GetAllRecipesForUserUsecase } from "@/application-layer/use-cases/recipe/GetAllRecipesForUser/GetAllRecipesForUser.usecase";
import { Recipe } from "@/domain/entities/recipe/Recipe";
import { User } from "@/domain/entities/user/User";
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
  let user1: User;
  let user2: User;
  const userId1 = userTestProps.userId;
  const userId2 = "user-2";

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    user1 = userTestProps.createTestUser();

    user2 = userTestProps.createTestUser({
      id: userId2,
    });

    testRecipes = [
      recipeTestProps.createTestRecipe({}, 1),
      recipeTestProps.createTestRecipe(
        {
          id: "recipe2",
        },
        2,
      ),
    ];

    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }
    await usersRepo.saveUser(user1);
    await usersRepo.saveUser(user2);
  });

  it("returns JSEND format", async () => {
    const params = Promise.resolve({ userId: userId1 });

    const response = await GET(
      new Request(`http://localhost/api/recipe/${userId1}`),
      { params: { userId: userId1 } },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("returns all recipes for a user", async () => {
    const response = await GET(
      new Request(`http://localhost/api/recipe/${userId1}`),
      { params: { userId: userId1 } },
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
