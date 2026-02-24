'use client';

import { AssembledDayResult } from '@/app/_features/day/actions';
import DaySummary from '@/app/_features/day/DaySummary';
import SelectRecipeModal from '@/app/_features/recipe/SelectRecipeModal';
import ButtonNew from '@/app/_ui/ButtonNew';
import Modal from '@/app/_ui/Modal';
import { useState } from 'react';

function MealsDisplay({
  assembledDays,
}: {
  assembledDays: AssembledDayResult[];
}) {
  const [selectedDaysIds, setSelectedDaysIds] = useState<string[]>([]);

  function handleSelectDay(dayId: string) {
    setSelectedDaysIds((prevSelectedDaysIds) => {
      if (prevSelectedDaysIds.includes(dayId)) {
        return prevSelectedDaysIds.filter((id) => id !== dayId);
      } else {
        return [...prevSelectedDaysIds, dayId];
      }
    });
  }

  function isDaySelected(dayId: string) {
    return selectedDaysIds.includes(dayId);
  }

  async function addMealsRequest(recipesIds: string[]) {
    const response = await fetch('/api/day/addMultipleMealsToMultipleDays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dayIds: selectedDaysIds,
        recipeIds: recipesIds,
      }),
    });

    if (response.ok) setSelectedDaysIds([]);
  }

  return (
    <Modal>
      <Modal.Open opens="add-food-to-days-modal">
        <ButtonNew className="mb-8 " disabled={selectedDaysIds.length < 1}>
          Añadir comidas a varios días
        </ButtonNew>
      </Modal.Open>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(5rem,20rem))] gap-4">
        {assembledDays.map(({ dayId, assembledDay }) => (
          <DaySummary
            key={dayId}
            dayId={dayId}
            assembledDay={assembledDay}
            onSelectDay={handleSelectDay}
            isSelected={isDaySelected(dayId)}
          />
        ))}
      </div>

      <Modal.Window name="add-food-to-days-modal">
        <SelectRecipeModal addMealsRequest={addMealsRequest} />
      </Modal.Window>
    </Modal>
  );
}

export default MealsDisplay;
