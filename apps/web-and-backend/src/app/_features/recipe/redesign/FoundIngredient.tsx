import { IngredientDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAdd from "@/app/_ui/buttons/ButtonAdd";
import ButtonPlus from "@/app/_ui/buttons/ButtonPlus";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

function FoundIngredient({
  ingredient,
  ...props
}: { ingredient: IngredientDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const calories = formatToInteger(ingredient.nutritionalInfoPer100g.calories);
  const protein = formatToInteger(ingredient.nutritionalInfoPer100g.protein);

  return (
    <div
      className={twMerge(
        "grid grid-cols-[1fr_max-content] bg-background-app p-2.5 rounded-xl",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-semibold">{ingredient.name}</span>

        <span className="text-[12px] text-text-minor-emphasis-app font-medium">
          {calories} kcal · {protein} g proteína cada 100g
        </span>
      </div>

      <ButtonAdd type="button" />
    </div>
  );
}

export default FoundIngredient;
