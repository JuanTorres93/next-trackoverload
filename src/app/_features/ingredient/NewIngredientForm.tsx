'use client';

import Input from '@/app/_ui/Input';
import Form from '@/app/_ui/NewResourceForm';
import { useFormSetup, useResetOnSuccess } from '@/app/_utils/form/hooks';
import { createIngredient } from './actions';

function NewIngredientForm() {
  const { formRef, pending, startTransition, formState, formAction } =
    useFormSetup(createIngredient);

  useResetOnSuccess(formRef, formState, pending);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form
      ref={formRef}
      submitText="Crear ingrediente"
      isPending={pending}
      onSubmit={handleSubmit}
    >
      <Form.FormRow label="Nombre" error={formState.errors.name}>
        <Input
          disabled={pending}
          name="name"
          placeholder="Nombre del ingrediente"
          required
        />
      </Form.FormRow>

      <Form.FormRow label="Calorías por 100g" error={formState.errors.calories}>
        <Input
          disabled={pending}
          name="calories"
          placeholder="Calorías del ingrediente"
        />
      </Form.FormRow>

      <Form.FormRow label="Proteínas por 100g" error={formState.errors.protein}>
        <Input
          disabled={pending}
          name="protein"
          placeholder="Proteínas del ingrediente"
        />
      </Form.FormRow>
    </Form>
  );
}

export default NewIngredientForm;
