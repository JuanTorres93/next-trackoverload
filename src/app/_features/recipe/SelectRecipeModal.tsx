import SelectRecipeForm from './SelectRecipeForm';

function SelectRecipeModal({
  addMealsRequest,
  onCloseModal,
}: {
  addMealsRequest: (recipesIds: string[]) => Promise<void>;
  onCloseModal?: () => void;
}) {
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <SelectRecipeForm
        addMealsRequest={addMealsRequest}
        onSuccess={onCloseModal}
      />
    </div>
  );
}

export default SelectRecipeModal;
