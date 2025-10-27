import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';

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
    <div className="p-3 min-w-52 rounded-lg grid grid-cols-2 grid-rows-[max-content_min-content_min-content] gap-4 bg-neutral-50 shadow-md">
      <div className="relative col-span-2 rounded-lg overflow-hidden h-32">
        <Image src="/test-image.png" alt="Recipe name" fill />
      </div>
      <h2 className="col-span-2 text-center">{recipe.name}</h2>

      <NumberContainer number={recipe.calories} label="Calorías" />

      <NumberContainer number={recipe.protein} label="Proteínas" />
    </div>
  );
}

export default RecipeCard;
