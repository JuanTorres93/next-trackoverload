import { HiOutlineX } from 'react-icons/hi';
import Input from '@/app/_ui/Input';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import Image from 'next/image';

function IngredientLineItem({
  ingredientLine,
  onQuantityChange,
  onRemove,
}: {
  ingredientLine: IngredientLineDTO;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const totalCalories = Math.round(
    (ingredientLine.calories * ingredientLine.quantityInGrams) / 100
  );
  const totalProtein = Math.round(
    (ingredientLine.protein * ingredientLine.quantityInGrams) / 100
  );

  return (
    <div className="grid grid-rows-[min-content_min-content] overflow-hidden rounded-xl bg-neutral-100 ">
      <div className="grid grid-cols-[40px_1fr_5rem_min-content] p-2  gap-4 items-center">
        <div className="relative h-12 overflow-hidden rounded-md aspect-square">
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

        <div onClick={onRemove}>
          <HiOutlineX className="text-xl cursor-pointer text-neutral-500 hover:text-red-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 p-2 text-sm text-center bg-neutral-200 text-neutral-600">
        <NutritionalInfoValue number={totalCalories} label="Calorías" />
        <NutritionalInfoValue number={totalProtein} label="Proteínas" />
      </div>
    </div>
  );
}

export default IngredientLineItem;
