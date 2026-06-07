import { MealDTO } from "shared";
import { twMerge } from "tailwind-merge";

import FoodGrid from "../../common/redesign/FoodGrid";
import Meal from "./Meal";

function MealsGrid({
  meals,
  ...props
}: {
  meals: MealDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <FoodGrid className={twMerge("", className)} {...rest}>
      {meals.map((meal) => (
        <Meal key={meal.id} meal={meal} />
      ))}
    </FoodGrid>
  );
}

export default MealsGrid;
