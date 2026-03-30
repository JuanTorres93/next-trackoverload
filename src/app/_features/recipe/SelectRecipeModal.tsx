import SelectRecipeForm from './SelectRecipeForm';

function SelectRecipeModal({
  addMealsRequest,
  onCloseModal,
}: {
  addMealsRequest: (recipesIds: string[]) => Promise<void>;
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
