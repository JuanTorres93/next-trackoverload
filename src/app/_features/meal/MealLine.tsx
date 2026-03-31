"use client";
import Image from "next/image";

import { useState } from "react";

import ButtonX from "@/app/_ui/buttons/ButtonX";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { MealDTO } from "@/application-layer/dtos/MealDTO";

import LoadingOverlay from "../common/LoadingOverlay";
import { removeMealFromDay } from "../day/actions";

function MealLine({
  meal,
  className,
  dayId,
}: {
  meal: MealDTO;
  className?: string;
  dayId?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    if (!dayId) return;
    setIsLoading(true);
    try {
      await removeMealFromDay(dayId, meal.id);
    } finally {
      setIsLoading(false);
    }
  }

  const imageUrl = meal.imageUrl || "/recipe-no-picture.webp";

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-2.5 bg-surface-card ${className ?? ""}`}
    >
      {isLoading && <LoadingOverlay />}

      <div className="relative overflow-hidden border rounded-full w-9 h-9 shrink-0 border-border/40">
        <Image fill src={imageUrl} alt={meal.name} className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-text">{meal.name}</p>

        <p className="text-xs text-text-minor-emphasis">
          {formatToInteger(meal.calories)} kcal ·{" "}
          {formatToInteger(meal.protein)} g prot
        </p>
      </div>

      {dayId && (
        <ButtonX
          data-testid="nutritional-summary-delete-button"
          onClick={handleRemove}
        />
      )}
    </div>
  );
}

export default MealLine;
