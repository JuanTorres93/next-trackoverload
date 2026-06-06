import { RecipeDTO } from "shared";
import { JSENDResponse } from "shared";

import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import Recipe from "@/app/_features/recipe/redesign/Recipe";
import ErrorBox from "@/app/_ui/ErrorBox";
import Header from "@/app/_ui/Header";
import Navbar from "@/app/_ui/Navbar/Navbar";
import PageWrapper from "@/app/_ui/PageWrapper";
import Screen from "@/app/_ui/Screen";

import RecipesDisplay from "../RecipesDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function RecipesPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  if (hasError) {
    return (
      <Screen title="Recetas">
        {/* TODO: return an styled error message if has error */}
        <span>
          Hubo un error al cargar tus recetas. Por favor, inténtalo de nuevo más
          tarde.
        </span>
      </Screen>
    );
  }

  const recipes = recipesResponse.data;

  return (
    <Screen title="Recetas">
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} />
      ))}
    </Screen>
  );
}
