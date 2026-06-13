"use client";

import Link from "next/link";

import { useState } from "react";

import { HiPlus } from "react-icons/hi2";
import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonActionWeak from "@/app/_ui/buttons/ButtonActionWeak";
import AppHeader from "@/app/_ui/typography/AppHeader";
import TextLink from "@/app/_ui/typography/TextLink";

import { addMealsToDay } from "../day/actions";
import { getTodayDayId } from "../day/utils/getTodayDayId";
import RecipeSummary from "../recipe/redesign/RecipeSummary";

function RecentRecipes({
  recipes,
  ...props
}: {
  recipes: RecipeDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const [isLoading, setIsLoading] = useState(false);

  const todayId = getTodayDayId();

  const hasRecipes = recipes.length > 0;

  const last3Recipes = recipes.slice(-3).reverse();

  async function handleAddMeal(recipeId: string) {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await addMealsToDay(todayId, [recipeId]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={twMerge("flex flex-col gap-3", className)} {...rest}>
      <AppHeader className="flex justify-between itecms-center">
        <span>Recetas recientes</span>

        <Link href="/app/recipes/new">
          <TextLink className="flex items-center gap-1">
            <HiPlus strokeWidth={1} />
            Crear receta
          </TextLink>
        </Link>
      </AppHeader>

      {!hasRecipes && (
        <span className="text-text-minor-emphasis-app">
          No has creado ninguna receta.
        </span>
      )}

      {hasRecipes && (
        <ul className="flex flex-col items-stretch gap-3">
          {last3Recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex items-center rounded-xl pr-2.5 justify-between gap-2 bg-white"
            >
              <RecipeSummary
                className="bg-white rounded-xl p-3.75"
                recipe={recipe}
              />

              <ButtonActionWeak
                disabled={isLoading}
                onClick={() => handleAddMeal(recipe.id)}
              >
                Añadir
              </ButtonActionWeak>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentRecipes;
