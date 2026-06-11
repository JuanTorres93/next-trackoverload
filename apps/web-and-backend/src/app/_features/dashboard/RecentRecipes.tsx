import Link from "next/link";

import { HiPlus } from "react-icons/hi2";
import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonActionWeak from "@/app/_ui/buttons/ButtonActionWeak";
import AppHeader from "@/app/_ui/typography/AppHeader";
import TextLink from "@/app/_ui/typography/TextLink";

import RecipeSummary from "../recipe/redesign/RecipeSummary";

function RecentRecipes({
  recipes,
  ...props
}: {
  recipes: RecipeDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const hasRecipes = recipes.length > 0;

  const last3Recipes = recipes.slice(-3).reverse();

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
        <ul className="flex flex-col items-stretch gap-3 overflow-y-scroll">
          {last3Recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex items-center rounded-xl pr-2.5 justify-between gap-2 bg-white"
            >
              <RecipeSummary
                className="bg-white rounded-xl p-3.75"
                recipe={recipe}
              />

              <ButtonActionWeak>Añadir</ButtonActionWeak>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentRecipes;
