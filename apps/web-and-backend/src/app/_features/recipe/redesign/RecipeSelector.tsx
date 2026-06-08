import Image from "next/image";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import defaultRecipeImage from "@/../public/recipe-no-picture.webp";
import Checkbox from "@/app/_ui/Checkbox";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

function RecipeSelector({
  recipe,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  return (
    <article
      className={twMerge(
        "grid grid-cols-[min-content_1fr] gap-3.75 py-3 items-center justify-center px-3.75 rounded-xl bg-white",
        className,
      )}
      {...rest}
    >
      <Checkbox />

      <section className="flex items-center gap-2.5">
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
      </section>
    </article>
  );
}

export default RecipeSelector;
