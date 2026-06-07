import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import Food from "../../common/redesign/Food";

function Recipe({
  recipe,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return <Food className={twMerge("", className)} food={recipe} {...rest} />;
}

export default Recipe;
