'use client';

import { AssembledDayResult } from '@/app/_features/day/actions';
import DaySummary from '@/app/_features/day/DaySummary';
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

  return (
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
  );
}

export default MealsDisplay;
