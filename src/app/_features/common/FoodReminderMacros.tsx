function FoodReminderMacros({
  calories,
  protein,
  className = '',
}: {
  calories: number;
  protein: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 text-xs opacity-60 ${className}`}>
      <span className="font-semibold ">{calories} kcal</span>

      <span aria-hidden="true">·</span>

      <span className="opacity-90">{protein} g proteína</span>
    </div>
  );
}

export default FoodReminderMacros;
