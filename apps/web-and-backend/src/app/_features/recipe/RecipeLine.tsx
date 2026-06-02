"use client";
import { RecipeDTO } from "shared";

import NutritionSummary from "../../_ui/NutritionSummary";

function RecipeLine({ recipe }: { recipe: RecipeDTO }) {
  return <NutritionSummary line={recipe} />;
}

export default RecipeLine;
