"use client";
import { HiBolt } from "react-icons/hi2";

import { FakeMealDTO } from "../../../application-layer/dtos/FakeMealDTO";
import FoodReminderContainer from "../common/FoodReminderContainer";
import FoodReminderMacros from "../common/FoodReminderMacros";

function EatenFakeMeal({
  fakeMeal,
  dayId,
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
}) {
  return (
    <FoodReminderContainer isEaten>
      <div className="flex items-center min-w-0 gap-3 p-3 cursor-default">
        <div className="flex items-center justify-center rounded-full w-9 h-9 shrink-0 bg-white/20">
          <HiBolt className="text-lg" />
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-semibold leading-snug truncate">{fakeMeal.name}</p>

          <FoodReminderMacros
            calories={fakeMeal.calories}
            protein={fakeMeal.protein}
          />
        </div>
      </div>
    </FoodReminderContainer>
  );
}

export default EatenFakeMeal;
