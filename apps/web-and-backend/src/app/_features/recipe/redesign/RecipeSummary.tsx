import Image from "next/image";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import defaultRecipeImage from "@/../public/recipe-no-picture.webp";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

function RecipeSummary({
  recipe,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  return (
    <article
      className={twMerge("flex items-center gap-2.5", className)}
      {...rest}
    >
      <figure className="relative size-17.5 rounded-lg overflow-hidden">
        <Image
          // TODO: DRY this logic, it is used in other modules
          src={recipe.imageUrl || defaultRecipeImage}
          alt={recipe.name}
          fill
          className="object-cover"
        />
      </figure>

      <div className="font-medium">
        <h3 className="text-[16px]">{recipe.name}</h3>

        <span className="text-[14px] text-text-minor-emphasis-app">
          {calories} kcal · {protein}g protein
        </span>
      </div>
    </article>
  );
}

export default RecipeSummary;
