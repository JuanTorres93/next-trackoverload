import { CreateIngredientLineData, UserDTO } from "shared";

import { createUniqueUserProps } from "../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;
  let baseRequest: {
    userId: string;
    recipeName: string;
    ingredientLinesInfo: CreateIngredientLineData[];
    imageBuffer?: Buffer;
  };

  beforeAll(() => {
    backendService = new TestApplicationBackendService();

    const userTestProps = createUniqueUserProps();
    user = {
      name: userTestProps.name,
      email: userTestProps.email,
    } as UserDTO;

    baseRequest = {
      userId: user.id,
      recipeName: "Test Recipe",
      ingredientLinesInfo: [
        {
          externalIngredientId: "123",
          source: "test",
          name: "Test Ingredient",
          caloriesPer100g: 200,
          proteinPer100g: 10,
          quantityInGrams: 150,
        },
      ],
      imageBuffer: undefined,
    };
  });

  describe("Recipes", () => {
    it("should create recipe", async () => {
      // TODO NEXT: Create login and logout methods and make this test pass
      const newRecipeResponse = await backendService.createRecipe(
        baseRequest.userId,
        baseRequest.recipeName,
        baseRequest.ingredientLinesInfo,
        baseRequest.imageBuffer,
      );

      // expect(newRecipeResponse.status).toBe("success");
      //
      // expect(newRecipeResponse.data).toHaveProperty("id");
      // expect(newRecipeResponse.data.name).toBe(baseRequest.recipeName);
    });
  });
});
