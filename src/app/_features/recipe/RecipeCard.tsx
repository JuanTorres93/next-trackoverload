import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import Link from 'next/link';

function NumberContainer({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-medium">{number}</span>
      <span className="text-sm text-zinc-600 mt-[-5px]">{label}</span>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: RecipeDTO }) {
  return (
    <Link
      href={`/app/recipes/${recipe.id}`}
      className="p-3 min-w-52 rounded-lg grid grid-cols-2 grid-rows-[max-content_min-content_min-content] gap-4 bg-neutral-50 shadow-md hover:cursor-pointer hover:shadow-lg transition hover:bg-neutral-100"
    >
      <div className="relative col-span-2 rounded-lg overflow-hidden h-32">
        <Image
          src={recipe.imageUrl ? recipe.imageUrl : '/recipe-no-picture.png'}
          alt="Recipe name"
          fill
          className="object-cover"
        />
      </div>
      <h2 className="col-span-2 text-center">{recipe.name}</h2>

      <NumberContainer number={recipe.calories} label="Calorías" />

      <NumberContainer number={recipe.protein} label="Proteínas" />
    </Link>
  );
}

export default RecipeCard;
