import * as recipeTestProps from "../../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../../tests/createProps/userTestProps";
import { TestRecipesRepo } from "../../../../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../../../../tests/repos/TestUsersRepo";
import { Recipe } from "../../../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../../__tests__/registerUserInAPITests";
import { GET } from "../route";

describe("GET /api/recipe/[recipeId]/user/[userId]", () => {
  let testRecipe: Recipe;

  let user1: User;
  let user1Id: string;

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
    const response = await GET(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/user/${user1Id}`,
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          userId: user1Id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/user/${user1Id}`,
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          userId: user1Id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("returns the recipe for a user", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/user/${user1Id}`,
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          userId: user1Id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testRecipe.id);
    expect(data.data).toHaveProperty("userId", user1Id);
  });

  it("returns null if the recipe does not belong to the user", async () => {
    await loginInAPITests(user1.email);

    const response = await GET(
      new Request(
        `http://localhost/api/recipe/non-existent-recipe/user/${user1Id}`,
      ),
      {
        params: Promise.resolve({
          recipeId: "non-existent-recipe",
          userId: user1Id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeNull();
  });

  describe("Errors", () => {
    it("should throw AuthenticationError if user is not logged in", async () => {
      const response = await GET(
        new Request(
          `http://localhost/api/recipe/${testRecipe.id}/user/${user1Id}`,
        ),
        {
          params: Promise.resolve({
            recipeId: testRecipe.id,
            userId: user1Id,
          }),
        },
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
        new Request(
          `http://localhost/api/recipe/${testRecipe.id}/user/${nonExistentUserId}`,
        ),
        {
          params: Promise.resolve({
            recipeId: testRecipe.id,
            userId: nonExistentUserId,
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
