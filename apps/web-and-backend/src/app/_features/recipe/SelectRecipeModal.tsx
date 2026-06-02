import { JSENDResponse } from "shared";

import SelectRecipeForm from "./SelectRecipeForm";

function SelectRecipeModal({
  addMealsRequest,
  onCloseModal,
}: {
  addMealsRequest: (recipesIds: string[]) => Promise<JSENDResponse<void>>;
  onCloseModal?: () => void;
}) {
  return (
    <SelectRecipeForm
      addMealsRequest={addMealsRequest}
      onSuccess={onCloseModal}
    />
  );
}

export default SelectRecipeModal;
