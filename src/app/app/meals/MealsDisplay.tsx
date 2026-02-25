'use client';

import { AssembledDayResult } from '@/app/_features/day/actions';
import DaySummary from '@/app/_features/day/DaySummary';
import WeekSelector from '@/app/_features/day/WeekSelector';
import SelectRecipeModal from '@/app/_features/recipe/SelectRecipeModal';
import ButtonNew from '@/app/_ui/ButtonNew';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Modal from '@/app/_ui/Modal';
import { useState } from 'react';

function MealsDisplay({
  assembledDays,
}: {
  assembledDays: AssembledDayResult[];
}) {
  const [selectedDaysIds, setSelectedDaysIds] = useState<string[]>([]);

  const areDaysSelected = selectedDaysIds.length > 0;

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

  function clearSelectedDays() {
    if (!areDaysSelected) return;

    setSelectedDaysIds([]);
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
      <div className="fixed top-0 z-10 flex flex-col w-full gap-4 py-4 bg-background">
        <WeekSelector />
        <div className="flex gap-4">
          <Modal.Open opens="add-food-to-days-modal">
            <ButtonNew disabled={selectedDaysIds.length < 1}>
              Añadir comidas a varios días
            </ButtonNew>
          </Modal.Open>

          {areDaysSelected && (
            <ButtonPrimary
              className="text-selected border-selected hover:bg-selected"
              onClick={clearSelectedDays}
            >
              Limpiar selección
            </ButtonPrimary>
          )}
        </div>
      </div>

      <div className="grid pl-1 mt-33 grid-cols-[repeat(auto-fill,minmax(5rem,20rem))] gap-4">
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
