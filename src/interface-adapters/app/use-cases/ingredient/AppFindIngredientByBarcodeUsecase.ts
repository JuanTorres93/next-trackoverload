import { FindIngredientByBarcodeUsecase } from "@/application-layer/use-cases/ingredient/FindIngredientByBarcode/FindIngredientByBarcodeUsecase";
import { createAppIngredientFinder } from "@/interface-adapters/app/services/AppIngredientFinder";

export function createAppFindIngredientByBarcodeUsecase(
  clientId: string,
): FindIngredientByBarcodeUsecase {
  return new FindIngredientByBarcodeUsecase(
    createAppIngredientFinder(clientId),
  );
}
