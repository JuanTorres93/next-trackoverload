import { FindIngredientByFuzzyNameUsecase } from "../../../../application-layer/use-cases/ingredient/FindIngredientByFuzzyName/FindIngredientByFuzzyNameUsecase";
import { createAppIngredientFinder } from "../../services/AppIngredientFinder";

export function createAppFindIngredientByFuzzyNameUsecase(
  clientId: string,
): FindIngredientByFuzzyNameUsecase {
  return new FindIngredientByFuzzyNameUsecase(
    createAppIngredientFinder(clientId),
  );
}
