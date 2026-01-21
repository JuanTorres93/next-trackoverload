import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type CreateIngredientLineData = {
  externalIngredientId: string;
  source: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  imageUrl?: string;
  quantityInGrams: number;
};

export async function createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
  ingredientLinesInfo: CreateIngredientLineData[],
  ingredientsRepo: IngredientsRepo,
  externalIngredientsRefRepo: ExternalIngredientsRefRepo,
  idGenerator: IdGenerator,
) {
  // Check if ingredient
  const externalIngredientIds = ingredientLinesInfo.map(
    (info) => info.externalIngredientId,
  );

  const fetchedExternalIngredients: ExternalIngredientRef[] =
    await externalIngredientsRefRepo.getByExternalIdsAndSource(
      externalIngredientIds,
      ingredientLinesInfo[0].source,
    );

  // Get existing ingredients
  const existingIngredients = await ingredientsRepo.getIngredientsByIds(
    fetchedExternalIngredients.map((ref) => ref.ingredientId),
  );

  // If any ingredient is missing, create it along with its ExternalIngredientRef
  const createdExternalIngredients: Record<string, ExternalIngredientRef> = {};
  const createdIngredients: Record<string, Ingredient> = {};

  if (externalIngredientIds.length !== fetchedExternalIngredients.length) {
    for (const lineInfo of ingredientLinesInfo) {
      const exists = fetchedExternalIngredients.find(
        (ing) =>
          ing.externalId === lineInfo.externalIngredientId &&
          ing.source === lineInfo.source,
      );

      if (exists) continue;

      // Create new ExternalIngredientRef
      const newIngredientId = idGenerator.generateId();

      createdExternalIngredients[lineInfo.externalIngredientId] =
        ExternalIngredientRef.create({
          externalId: lineInfo.externalIngredientId,
          source: lineInfo.source,
          ingredientId: newIngredientId,
          createdAt: new Date(),
        });

      // Create new Ingredient
      createdIngredients[lineInfo.externalIngredientId] = Ingredient.create({
        id: newIngredientId,
        name: lineInfo.name,
        calories: lineInfo.caloriesPer100g,
        protein: lineInfo.proteinPer100g,
        imageUrl: lineInfo.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // Get quantities for each ingredient line
  const quantitiesMapByExternalId: Record<
    string,
    { ingredientId: string; quantityInGrams: number }
  > = {};

  // Existing ingredients
  for (const existingExternalIngredient of fetchedExternalIngredients) {
    const lineInfo = ingredientLinesInfo.find(
      (info) =>
        info.externalIngredientId === existingExternalIngredient.externalId,
    );

    quantitiesMapByExternalId[existingExternalIngredient.externalId] = {
      ingredientId: existingExternalIngredient.ingredientId,
      quantityInGrams: lineInfo!.quantityInGrams,
    };
  }

  // Just created ingredients
  for (const missingExtIngredientId of Object.keys(
    createdExternalIngredients,
  )) {
    const lineInfo = ingredientLinesInfo.find(
      (info) => info.externalIngredientId === missingExtIngredientId,
    );

    quantitiesMapByExternalId[missingExtIngredientId] = {
      ingredientId:
        createdExternalIngredients[missingExtIngredientId].ingredientId,
      quantityInGrams: lineInfo!.quantityInGrams,
    };
  }

  const allIngredients = [
    ...existingIngredients,
    ...Object.values(createdIngredients),
  ];

  return {
    existingIngredients,
    fetchedExternalIngredients,
    createdIngredients,
    createdExternalIngredients,
    allIngredients,
    quantitiesMapByExternalId,
  };
}
