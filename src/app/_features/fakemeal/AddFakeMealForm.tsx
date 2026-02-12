import ButtonNew from '@/app/_ui/ButtonNew';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import { useState } from 'react';
import { addFakeMealToDay } from './actions';

export type AddFakeMealFormState = {
  name: string;
  calories: number;
  protein: number;
};

type FormErrors = Record<keyof AddFakeMealFormState, string>;

const INITIAL_FORM_STATE: AddFakeMealFormState = {
  name: 'Comida en datos',
  calories: 0,
  protein: 0,
};

function AddFakeMealForm({
  dayId,
  onSuccess,
}: {
  dayId: string;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] =
    useState<AddFakeMealFormState>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<FormErrors>({} as FormErrors);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const invalidForm =
    formState.name.trim() === '' ||
    formState.calories < 0 ||
    formState.protein < 0 ||
    isLoading;

  function setField<FormKey extends keyof AddFakeMealFormState>(
    key: FormKey,
    value: AddFakeMealFormState[FormKey],
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      await addFakeMealToDay(
        dayId,
        formState.name,
        formState.calories,
        formState.protein,
      );

      handleResetForm();
      onSuccess?.();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetForm() {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({} as FormErrors);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormEntry labelText="Nombre de la comida" htmlFor="fake-meal-name">
        <Input
          id="fake-meal-name"
          value={formState.name}
          onChange={(e) => setField('name', e.target.value)}
        />
      </FormEntry>

      <FormEntry labelText="Calorías" htmlFor="fake-meal-calories">
        <Input
          id="fake-meal-calories"
          type="number"
          value={formState.calories}
          onChange={(e) => setField('calories', Number(e.target.value))}
        />
      </FormEntry>

      <FormEntry labelText="Proteínas" htmlFor="fake-meal-proteins">
        <Input
          id="fake-meal-proteins"
          type="number"
          value={formState.protein}
          onChange={(e) => setField('protein', Number(e.target.value))}
        />
      </FormEntry>

      <ButtonNew type="submit" className="mt-8" disabled={invalidForm}>
        Añadir comida
      </ButtonNew>
    </form>
  );
}

export default AddFakeMealForm;
