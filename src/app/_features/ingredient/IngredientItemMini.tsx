import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Image from 'next/image';

function IngredientItemMini({
  ingredient,
  isSelected = false,
  ...props
}: {
  ingredient: IngredientDTO;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`grid p-2 rounded-xl grid-cols-[40px_1fr_min-content] bg-neutral-100  gap-8 items-center hover:bg-neutral-200 cursor-pointer transition 
        ${isSelected ? 'bg-zinc-50 text-zinc-500' : ''}`}
      {...props}
    >
      <div className="relative overflow-hidden rounded-md h-14 aspect-square">
        <Image
          fill
          src={ingredient.imageUrl || '/ingredient-no-picture.png'}
          alt="Ingredient Image"
          className={`object-cover transition ${
            isSelected ? 'grayscale-75' : ''
          }`}
        />
      </div>
      <span className="font-semibold">{ingredient.name}</span>
    </div>
  );
}

export default IngredientItemMini;
