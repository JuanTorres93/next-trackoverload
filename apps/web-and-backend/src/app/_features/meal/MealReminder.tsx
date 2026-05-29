"use client";

import Image from "next/image";

import { useOptimistic, useState, useTransition } from "react";

import { MealDTO } from "../../../application-layer/dtos/MealDTO";
import { showErrorToast } from "../../_ui/showErrorToast";
import { formatToInteger } from "../../_utils/format/formatToInteger";
import FoodReminderContainer from "../common/FoodReminderContainer";
import FoodReminderMacros from "../common/FoodReminderMacros";
import { removeMealFromDay } from "../day/actions";
import { toggleIsEaten } from "./actions";

function MealReminder({ meal, dayId }: { meal: MealDTO; dayId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [optimisticIsEaten, setOptimisticIsEaten] = useOptimistic(
    meal.isEaten ?? false,
    (_: boolean, newValue: boolean) => newValue,
  );

  const defaultImageUrl = "/recipe-no-picture.webp";

  const calories = formatToInteger(meal.calories);
  const protein = formatToInteger(meal.protein);

  function handleToggleIsEaten() {
    if (isPending) return;

    startTransition(() => {
      setOptimisticIsEaten(!optimisticIsEaten);
    });

    toggleIsEaten(meal.id).then((jsend) => {
      if (jsend.status === "success") return;

      showErrorToast(
        jsend.data?.message ||
          "Ha ocurrido un error al marcar la comida como comida. Por favor, intenta nuevamente.",
      );
    });
  }

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);

    startTransition(async () => {
      try {
        const jsend = await removeMealFromDay(dayId, meal.id);

        if (jsend.status === "success") return;

        showErrorToast(
          jsend.data?.message ||
            "Ha ocurrido un error al eliminar la comida. Por favor, intenta nuevamente.",
        );
      } finally {
        setIsDeleting(false);
      }
    });
  }

  return (
    <FoodReminderContainer
      isEaten={optimisticIsEaten}
      onClick={handleToggleIsEaten}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    >
      <div
        className={`grid gap-4 grid-cols-[5rem_1fr] items-center content-center max-bp-navbar-mobile:grid-cols-[4rem_1fr] `}
      >
        <div className="relative overflow-hidden rounded-md shadow-xm aspect-square">
          <Image
            src={meal.imageUrl || defaultImageUrl}
            alt={meal.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 gap-2">
          <p className="text-lg font-semibold leading-snug max-bp-navbar-mobile:text-base">
            {meal.name}
          </p>

          <FoodReminderMacros calories={calories} protein={protein} />
        </div>
      </div>
    </FoodReminderContainer>
  );
}

export default MealReminder;
