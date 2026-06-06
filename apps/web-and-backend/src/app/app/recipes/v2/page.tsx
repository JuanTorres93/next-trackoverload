import { RecipeDTO } from "shared";
import { JSENDResponse } from "shared";

import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import ErrorBox from "@/app/_ui/ErrorBox";
import Header from "@/app/_ui/Header";
import Navbar from "@/app/_ui/Navbar/Navbar";
import PageWrapper from "@/app/_ui/PageWrapper";

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

  return (
    <PageWrapper className="max-w-5xl">
      <Header title="Recetas" />
      <Navbar />
    </PageWrapper>
  );
}
