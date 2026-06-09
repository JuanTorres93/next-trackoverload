import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import Checkbox from "@/app/_ui/Checkbox";

import RecipeSummary from "./RecipeSummary";

function RecipeSelector({
  recipe,
  onSelect,
  ...props
}: {
  recipe: RecipeDTO;
  onSelect?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <article
      className={twMerge(
        "grid grid-cols-[min-content_1fr] gap-3.75 py-3 items-center justify-center px-3.75 rounded-xl bg-white cursor-pointer",
        className,
      )}
      onClick={onSelect}
    >
      <Checkbox {...rest} />

      <RecipeSummary recipe={recipe} />
    </article>
  );
}

export default RecipeSelector;
