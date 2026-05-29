"use client";
import { useRouter } from "next/navigation";

import { HiPlus } from "react-icons/hi2";

import { JSENDResponse } from "@/app/_types/JSEND";

import Modal from "../../_ui/Modal";
import { addMealsToDay } from "../day/actions";
import AddFakeMealForm from "../fakemeal/AddFakeMealForm";
import SelectRecipeForm from "../recipe/SelectRecipeForm";
import { MealTypeSelectionModal } from "./MealTypeModal";

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

      <Modal.Window name="select-recipe" className="p-0 overflow-hidden">
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
  const router = useRouter();

  async function handleAddMeals(
    recipeIds: string[],
  ): Promise<JSENDResponse<void>> {
    const response = await addMealsToDay(dayId, recipeIds);

    if (response.status === "success") {
      router.refresh();
    }

    return response;
  }

  return (
    <SelectRecipeForm
      addMealsRequest={(recipeIds) => handleAddMeals(recipeIds)}
      onSuccess={onCloseModal}
    />
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
    <div className="max-w-200 max-h-160 overflow-y-scroll overscroll-contain w-[80dvw] p-4">
      <AddFakeMealForm dayId={dayId} onSuccess={onCloseModal} />
    </div>
  );
}

export default AddFoodButton;
