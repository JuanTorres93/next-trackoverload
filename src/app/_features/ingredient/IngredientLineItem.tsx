import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import Image from 'next/image';

function IngredientLineItem({
  ingredientLine,
}: {
  ingredientLine: IngredientLineDTO;
}) {
  return (
    <div className="grid p-2 rounded-xl grid-cols-[40px_1fr_min-content] bg-neutral-100  gap-8 items-center">
      <div className="relative overflow-hidden rounded-md h-14 aspect-square">
        <Image
          fill
          src={
            ingredientLine.ingredient.imageUrl || '/ingredient-no-picture.png'
          }
          alt="Ingredient Image"
          className="object-cover"
        />
      </div>
      <span className="font-semibold">{ingredientLine.ingredient.name}</span>
      <span className="text-neutral-500">
        {ingredientLine.quantityInGrams}g
      </span>
    </div>
  );
}

export default IngredientLineItem;
