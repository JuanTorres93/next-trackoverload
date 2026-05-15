import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
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
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();

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

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await GET(
      new Request(`http://localhost/api/recipe/${user1Id}`),
      { params: Promise.resolve({ userId: user1Id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(`http://localhost/api/recipe/${user1Id}`),
      { params: Promise.resolve({ userId: user1Id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("returns all recipes for a user", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(`http://localhost/api/recipe/${user1Id}`),
      { params: Promise.resolve({ userId: user1Id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
  });

  describe("Errors", () => {
    it("should throw AuthenticationError if user is not logged in", async () => {
      const response = await GET(
        new Request(`http://localhost/api/recipe/${user1Id}`),
        { params: Promise.resolve({ userId: user1Id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if user does not exist", async () => {
      await loginInAPITests(user1.email);

      const nonExistentUserId = "non-existent-user";

      const response = await GET(
        new Request(`http://localhost/api/recipe/${nonExistentUserId}`),
        { params: Promise.resolve({ userId: nonExistentUserId }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if user does not have permission to view recipes", async () => {
      await loginInAPITests(user1.email);

      const response = await GET(
        new Request(`http://localhost/api/recipe/${user2Id}`),
        { params: Promise.resolve({ userId: user2Id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
