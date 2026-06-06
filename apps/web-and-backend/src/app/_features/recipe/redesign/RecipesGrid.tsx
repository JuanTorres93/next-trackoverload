import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import Recipe from "@/app/_features/recipe/redesign/Recipe";

function RecipesGrid({
  recipes,
  ...props
}: {
  recipes: RecipeDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "grid grid-cols-[repeat(2,min-content)] gap-x-4.25 gap-y-5.5",
        className,
      )}
      {...rest}
    >
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipesGrid;
