'use client';
import { HiPlus } from 'react-icons/hi2';
import Modal from '@/app/_ui/Modal';
import SelectRecipeForm from '@/app/_features/recipe/SelectRecipeForm';
import AddFakeMealForm from '@/app/_features/fakemeal/AddFakeMealForm';
import { MealTypeSelectionModal } from './MealTypeModal';
import { addMealsToDay } from '@/app/_features/day/actions';

function AddFoodButton({ dayId }: { dayId: string }) {
  return (
    <Modal>
      <Modal.Open opens="add-food-selection">
        <button
          type="button"
          aria-label="Añadir comida"
          data-testid="add-food-button"
          className="flex items-center self-start gap-2 text-sm font-medium transition-colors cursor-pointer text-primary hover:text-primary/80"
        >
          <HiPlus className="w-5 h-5" />
          Añadir comida
        </button>
      </Modal.Open>

      <Modal.Window name="add-food-selection">
        <MealTypeSelectionModal title="Elige una opción para añadir" />
      </Modal.Window>

      <Modal.Window name="select-recipe">
        <AddRecipeModal dayId={dayId} />
      </Modal.Window>

      <Modal.Window name="add-fake-meal">
        <AddFakeMealModal dayId={dayId} />
      </Modal.Window>
    </Modal>
  );
}

function AddRecipeModal({
  dayId,
  onCloseModal,
}: {
  dayId: string;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <SelectRecipeForm
        addMealsRequest={(recipeIds) => addMealsToDay(dayId, recipeIds)}
        onSuccess={onCloseModal}
      />
    </div>
  );
}

function AddFakeMealModal({
  dayId,
  onCloseModal,
}: {
  dayId: string;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <AddFakeMealForm dayId={dayId} onSuccess={onCloseModal} />
    </div>
  );
}

export default AddFoodButton;
