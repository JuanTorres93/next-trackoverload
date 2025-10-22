export type IngredientDTO = {
  id: string;
  name: string;
  nutritionalInfoPer100g: {
    calories: number;
    protein: number;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
