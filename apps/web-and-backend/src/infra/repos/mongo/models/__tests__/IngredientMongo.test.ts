import { ingredientDTOProperties } from "../../../../../../tests/dtoProperties";
import IngredientMongo from "../IngredientMongo";
import { assertMongooseModelMatchesDTOProperties } from "./assertMongooseSchemaMatchesProperties";

// In mongo nutritional info is flattened
const ingredientModelProperties = Object.values(ingredientDTOProperties).filter(
  (prop) => prop !== "nutritionalInfoPer100g",
);
ingredientModelProperties.push("calories", "protein");

describe("IngredientMongo", () => {
  it("should have (at least) same properties as DTO", () => {
    assertMongooseModelMatchesDTOProperties(
      IngredientMongo,
      ingredientModelProperties,
    );
  });
});
