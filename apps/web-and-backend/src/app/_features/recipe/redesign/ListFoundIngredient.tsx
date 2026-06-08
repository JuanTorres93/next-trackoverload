import { IngredientDTO } from "shared";
import { twMerge } from "tailwind-merge";

import FoundIngredient from "./FoundIngredient";

function ListFoundIngredient({
  ingredients,
  ...props
}: {
  ingredients: IngredientDTO[];
} & React.HTMLAttributes<HTMLUListElement>) {
  const { className, ...rest } = props;

  return (
    <ul
      className={twMerge(
        "bg-white p-2.5 rounded-xl shadow-md flex flex-col gap-2.5",
        className,
      )}
      {...rest}
    >
      {ingredients.map((ingredient) => (
        <li key={ingredient.id}>
          <FoundIngredient ingredient={ingredient} />
        </li>
      ))}
    </ul>
  );
}

export default ListFoundIngredient;
