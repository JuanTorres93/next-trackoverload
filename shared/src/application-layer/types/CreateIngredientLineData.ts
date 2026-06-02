export type CreateIngredientLineData = {
  externalIngredientId: string;
  source: string;

  name: string;

  caloriesPer100g: number;
  proteinPer100g: number;

  imageUrl?: string;

  category?: string;

  quantityInGrams: number;
};
