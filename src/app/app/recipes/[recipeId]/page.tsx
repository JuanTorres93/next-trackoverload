'use client';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useParams } from 'next/navigation';

export default function RecipePage() {
  const params = useParams();
  const { recipeId } = params;

  // TODO fetch recipe by id from the server
  const recipe: RecipeDTO | null = null;

  return <div className="p-6">Recipe Id: {recipeId}</div>;
}
