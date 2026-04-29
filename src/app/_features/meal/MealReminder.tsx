"use client";

import Image from "next/image";

import { useOptimistic, useTransition } from "react";

import { showErrorToast } from "@/app/_ui/showErrorToast";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { MealDTO } from "@/application-layer/dtos/MealDTO";

import FoodReminderContainer from "../common/FoodReminderContainer";
import FoodReminderMacros from "../common/FoodReminderMacros";
import {
  replaceMealByAnotherMealForUserInDay,
  replaceMealByFakeMealForUserInDay,
} from "../day/actions";
import { toggleIsEaten } from "./actions";

function MealReminder({ meal, dayId }: { meal: MealDTO; dayId: string }) {
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

    toggleIsEaten(meal.id).catch(() => {
      showErrorToast(
        'No se ha podido marcar la comida como "' +
          (optimisticIsEaten ? "no comida" : "comida") +
          '"',
      );
    });
  }

  const replacement = {
    replaceMealRequest: (recipeId: string) =>
      replaceMealByAnotherMealForUserInDay(meal.id, recipeId, dayId),

    replaceFakeMealRequest: (name: string, calories: number, protein: number) =>
      replaceMealByFakeMealForUserInDay(
        meal.id,
        name,
        calories,
        protein,
        dayId,
      ),
  };

  return (
    <FoodReminderContainer
      isEaten={optimisticIsEaten}
      onClick={handleToggleIsEaten}
      replacement={replacement}
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
