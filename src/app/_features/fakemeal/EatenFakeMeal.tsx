import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import FoodReminderContainer from '../common/FoodReminderContainer';

function EatenFakeMeal({ fakeMeal }: { fakeMeal: FakeMealDTO }) {
  return (
    <FoodReminderContainer
      className="flex flex-col gap-2 p-3 cursor-default"
      isEaten
    >
      <p className="font-semibold leading-snug">{fakeMeal.name}</p>

      <div className="flex items-center gap-1.5 text-sm text-text-light/80">
        <span className="font-medium">{fakeMeal.calories} kcal</span>
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <span>{fakeMeal.protein} g proteína</span>
      </div>
    </FoodReminderContainer>
  );
}

export default EatenFakeMeal;
