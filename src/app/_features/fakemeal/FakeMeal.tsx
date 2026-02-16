import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import CaloriesAndProtein from '../common/CaloriesAndProtein';
import LoggedMealContainer from '../common/LoggedMealContainer';
import ButtonX from '@/app/_ui/ButtonX';
import { removeFakeMealFromDay } from './actions';

function FakeMeal({
  fakeMeal,
  dayId,
  ...props
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  function handleRemoveFakeMeal() {
    removeFakeMealFromDay(dayId, fakeMeal.id);
  }

  return (
    <LoggedMealContainer {...props}>
      <div className="grid grid-cols-[1fr_min-content] p-2 gap-4 items-center bg-surface-card">
        <span className="font-semibold">{fakeMeal.name}</span>

        <ButtonX
          data-testid="remove-fake-meal"
          onClick={handleRemoveFakeMeal}
        />
      </div>

      <CaloriesAndProtein
        calories={fakeMeal.calories}
        protein={fakeMeal.protein}
      />
    </LoggedMealContainer>
  );
}

export default FakeMeal;
