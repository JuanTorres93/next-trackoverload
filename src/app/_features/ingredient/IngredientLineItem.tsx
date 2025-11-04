import Input from '@/app/_ui/Input';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import Image from 'next/image';

function IngredientLineItem({
  ingredientLine,
  onQuantityChange,
}: {
  ingredientLine: IngredientLineDTO;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div className="grid p-2 rounded-xl grid-cols-[40px_1fr_5rem] bg-neutral-100  gap-8 items-center">
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
      <div className="relative flex items-center text-neutral-500">
        <Input
          className="w-full text-right border-none outline-none"
          type="number"
          defaultValue={ingredientLine.quantityInGrams}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          placeholder="gramos"
        />
        <span className="ml-[-.5rem]">g</span>
      </div>
    </div>
  );
}

export default IngredientLineItem;
