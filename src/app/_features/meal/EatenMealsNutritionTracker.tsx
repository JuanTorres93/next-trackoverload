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

  const allMealsAreEaten = eatenMeals.length === meals.length;

  if (eatenMeals.length === 0) {
    return (
      <div className="p-4 rounded bg-info/30">
        <span>Marca comidas para ver el progreso de hoy</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border shadow-sm rounded-xl bg-surface-card border-border/30">
      <div className="grid grid-cols-[1fr_min-content_1fr]">
        <NutrientStat
          label="Calorías"
          eaten={eatenCalories}
          total={totalCalories}
          isCompleted={allMealsAreEaten}
          valueClassName="text-primary"
        />

        {/* vertical line separator */}
        <div
          className={`flex items-center justify-center bg-surface-card ${allMealsAreEaten ? 'bg-primary!' : ''}`}
        >
          <div
            className={`border-l border-border/50 h-[60%]  ${allMealsAreEaten ? 'border-text-light/50!' : ''}`}
          ></div>
        </div>

        <NutrientStat
          label="Proteína"
          eaten={eatenProtein}
          total={totalProtein}
          isCompleted={allMealsAreEaten}
          unit="g"
        />
      </div>
    </div>
  );
}

function NutrientStat({
  label,
  eaten,
  total,
  isCompleted,
  unit = '',
  className = '',
  valueClassName = 'text-text',
}: {
  label: string;
  eaten: number;
  total: number;
  isCompleted: boolean;
  unit?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={`flex p-4 flex-col  text-text-minor-emphasis ${
        isCompleted && 'bg-primary text-text-light!'
      } ${className}`}
    >
      <span className="text-xs tracking-wide uppercase">{label}</span>

      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-semibold ${valueClassName} ${
            isCompleted && 'text-text-light!'
          }`}
        >
          {eaten}
          {unit}
        </span>

        <span className="text-sm">
          / {total}
          {unit}
        </span>
      </div>
    </div>
  );
}

export default EatenMealsNutritionTracker;
