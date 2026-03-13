import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import FoodReminderContainer from '../common/FoodReminderContainer';
import FoodReminderMacros from '../common/FoodReminderMacros';

function EatenFakeMeal({ fakeMeal }: { fakeMeal: FakeMealDTO }) {
  return (
    <FoodReminderContainer isEaten>
      <div className="flex flex-col gap-2 p-3 cursor-default">
        <p className="font-semibold leading-snug">{fakeMeal.name}</p>

        <FoodReminderMacros
          calories={fakeMeal.calories}
          protein={fakeMeal.protein}
        />
      </div>
    </FoodReminderContainer>
  );
}

export default EatenFakeMeal;
