import { MealDTO } from "shared";
import { twMerge } from "tailwind-merge";

import Food from "../../common/redesign/Food";

function Meal({
  meal,
  ...props
}: { meal: MealDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return <Food className={twMerge("", className)} food={meal} {...rest} />;
}

export default Meal;
