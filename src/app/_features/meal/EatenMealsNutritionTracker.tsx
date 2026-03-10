import { MealDTO } from '@/application-layer/dtos/MealDTO';

function EatenMealsNutritionTracker({ meals }: { meals: MealDTO[] }) {
  const eatenMeals = meals.filter((meal) => meal.isEaten);

  const totalCalories = Math.round(
    meals.reduce((acc, meal) => acc + meal.calories, 0),
  );
  const totalProtein = Math.round(
    meals.reduce((acc, meal) => acc + meal.protein, 0),
  );

  const eatenCalories = Math.round(
    eatenMeals.reduce((acc, meal) => acc + meal.calories, 0),
  );
  const eatenProtein = Math.round(
    eatenMeals.reduce((acc, meal) => acc + meal.protein, 0),
  );

  if (eatenMeals.length === 0) {
    return (
      <div className="p-4 rounded bg-info/30">
        <span>Marca comidas para ver el progreso de hoy</span>
      </div>
    );
  }

  return (
    <div className="p-4 border shadow-sm rounded-xl bg-surface-card border-border/30">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="text-xs tracking-wide uppercase text-text-minor-emphasis">
            Calorías
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-primary">
              {eatenCalories}
            </span>

            <span className="text-sm text-text-minor-emphasis">
              / {totalCalories}
            </span>
          </div>
        </div>

        <div className="flex flex-col pl-6 border-l border-border/40">
          <span className="text-xs tracking-wide uppercase text-text-minor-emphasis">
            Proteína
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-text">
              {eatenProtein}g
            </span>

            <span className="text-sm text-text-minor-emphasis">
              / {totalProtein}g
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EatenMealsNutritionTracker;
