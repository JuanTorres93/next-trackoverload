import { MealDTO } from "shared";
import { twMerge } from "tailwind-merge";

import AppHeader from "@/app/_ui/typography/AppHeader";

import MealsGrid from "../meal/redesign/MealsGrid";

function TodaysMeals({
  meals,
  ...props
}: {
  meals: MealDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const hasMeals = meals.length > 0;

  return (
    <section className={twMerge("flex flex-col gap-3", className)} {...rest}>
      <AppHeader>Comidas de hoy</AppHeader>

      {!hasMeals && (
        <span className="text-text-minor-emphasis-app">
          No has registrado ninguna comida hoy.
        </span>
      )}

      {hasMeals && (
        <MealsGrid className="flex overflow-x-scroll" meals={meals} />
      )}
    </section>
  );
}

export default TodaysMeals;
