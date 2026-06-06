import Image from "next/image";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import defaultImage from "@/../public/recipe-no-picture.webp";
import ButtonThreeDots from "@/app/_ui/buttons/ButtonThreeDots";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

function Recipe({
  recipe,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const calories = formatToInteger(recipe.calories);
  const protein = formatToInteger(recipe.protein);

  return (
    <article
      className={twMerge("min-w-42 flex flex-col gap-1.5", className)}
      {...rest}
    >
      <div className="relative overflow-hidden rounded-lg w-42 h-31.25">
        <Image
          src={recipe.imageUrl || defaultImage}
          alt={recipe.name}
          fill
          className="object-cover"
        />

        <ButtonThreeDots className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-[16px]">{recipe.name}</h3>

        <span className="text-[14px] text-text-minor-emphasis-app">
          {calories} kcal · {protein} g proteína
        </span>
      </div>
    </article>
  );
}

export default Recipe;
