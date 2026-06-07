import { IngredientDTO } from "shared";
import { twMerge } from "tailwind-merge";

import FoundIngredient from "./FoundIngredient";

function ListFoundIngredient({
  ingredients,
  ...props
}: {
  ingredients: IngredientDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-white p-2.5 rounded-xl shadow-md flex flex-col gap-2.5",
        className,
      )}
      {...rest}
    >
      {ingredients.map((ingredient) => (
        <FoundIngredient key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}

export default ListFoundIngredient;
