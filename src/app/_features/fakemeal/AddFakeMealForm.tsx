import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonNew from '@/app/_ui/buttons/ButtonNew';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { addFakeMealToDay } from './actions';

export type AddFakeMealFormState = {
  name: string;
  calories: string;
  protein: string;
};

const INITIAL_FORM_STATE: AddFakeMealFormState = {
  name: '',
  calories: '',
  protein: '',
};

function AddFakeMealForm({
  dayId,
  onSuccess,
  submitAction,
  submitLabel = 'Añadir comida',
}: {
  dayId?: string;
  onSuccess?: () => void;
  submitAction?: (
    name: string,
    calories: number,
    protein: number,
  ) => Promise<void>;
  submitLabel?: string;
}) {
  const { formState, isLoading, setIsLoading, setField, resetForm } =
    useFormSetup<AddFakeMealFormState>(INITIAL_FORM_STATE);

  const invalidForm =
    formState.name.trim() === '' ||
    formState.calories.trim() === '' ||
    formState.protein.trim() === '' ||
    Number(formState.calories) < 0 ||
    Number(formState.protein) < 0 ||
    isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (invalidForm) return;

    setIsLoading(true);

    try {
      const calories = Number(formState.calories);
      const protein = Number(formState.protein);

      if (submitAction) {
        await submitAction(formState.name, calories, protein);
      } else {
        await addFakeMealToDay(dayId!, formState.name, calories, protein);
      }

      resetForm();
      onSuccess?.();
    } catch {
      showErrorToast(
        'Error al añadir la comida. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormEntry labelText="Nombre de la comida" htmlFor="fake-meal-name">
        <Input
          id="fake-meal-name"
          value={formState.name}
          placeholder="Nombre de la comida"
          onChange={(e) => setField('name', e.target.value)}
        />
      </FormEntry>

      <FormEntry labelText="Calorías" htmlFor="fake-meal-calories">
        <Input
          id="fake-meal-calories"
          type="number"
          placeholder="Calorías"
          value={formState.calories}
          onChange={(e) => setField('calories', e.target.value)}
        />
      </FormEntry>

      <FormEntry labelText="Proteínas" htmlFor="fake-meal-proteins">
        <Input
          id="fake-meal-proteins"
          type="number"
          placeholder="Proteínas (g)"
          value={formState.protein}
          onChange={(e) => setField('protein', e.target.value)}
        />
      </FormEntry>

      <ButtonNew
        type="submit"
        className="mt-8"
        isLoading={isLoading}
        disabled={invalidForm}
      >
        {submitLabel}
      </ButtonNew>
    </form>
  );
}

export default AddFakeMealForm;
