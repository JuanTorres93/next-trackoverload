import { IngredientLineDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonClose from "@/app/_ui/buttons/ButtonClose";
import Input from "@/app/_ui/user-input/Input";

function IngredientLine({
  ingredientLine,
  ...props
}: {
  ingredientLine: IngredientLineDTO;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const ingredient = ingredientLine.ingredient;

  return (
    <div
      className={twMerge(
        "grid grid-cols-[1fr_152px_min-content] gap-3.75 p-2.5 items-center bg-white rounded-xl",
        className,
      )}
      {...rest}
    >
      <span className="font-semibold text-[16px]">{ingredient.name}</span>

      <Input placeholder={`${ingredientLine.quantityInGrams}g`} />

      <ButtonClose type="button" />
    </div>
  );
}

export default IngredientLine;
