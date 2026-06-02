export type IngredientDTO = {
  id: string;
  name: string;

  nutritionalInfoPer100g: {
    calories: number;
    protein: number;
  };

  imageUrl?: string;

  category: string;

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
