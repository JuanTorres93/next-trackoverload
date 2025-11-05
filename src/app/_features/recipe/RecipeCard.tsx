'use client';
import ButtonDeleteHover from '@/app/_ui/ButtonDeleteHover';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { deleteRecipe } from './actions';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import Link from 'next/link';

function RecipeCard({ recipe }: { recipe: RecipeDTO }) {
  return (
    <Link
      href={`/app/recipes/${recipe.id}`}
      className="p-3 min-w-52 rounded-lg grid grid-cols-2 grid-rows-[max-content_min-content_min-content] gap-4 bg-neutral-50 relative shadow-md hover:cursor-pointer hover:shadow-lg transition hover:bg-neutral-100"
    >
      <ButtonDeleteHover
        onClick={async () => {
          await deleteRecipe(recipe.id);
        }}
      />
      <div className="relative h-32 col-span-2 overflow-hidden rounded-lg">
        <Image
          src={recipe.imageUrl ? recipe.imageUrl : '/recipe-no-picture.png'}
          alt="Recipe name"
          fill
          className="object-cover"
        />
      </div>
      <h2 className="col-span-2 text-center">{recipe.name}</h2>

      <NutritionalInfoValue number={recipe.calories} label="Calorías" />

      <NutritionalInfoValue number={recipe.protein} label="Proteínas" />
    </Link>
  );
}

export default RecipeCard;
