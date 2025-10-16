'use client';

import { useActionState, useEffect, useRef, useTransition } from 'react';
import Input from '@/app/_ui/Input';
import Form from '@/app/_ui/NewResourceForm';
import { createIngredient } from './actions';
import { FormState } from '@/app/_types/FormState';

function NewIngredientForm() {
  const initialFormState: FormState = {
    ok: false,
    errors: {},
    message: '',
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [formState, formAction] = useActionState(
    createIngredient,
    initialFormState
  );

  useEffect(() => {
    // Effect for resetting the form upon successful submission
    if (!pending && formState.ok) {
      formRef.current?.reset();
    }
  }, [pending, formState.ok]);

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

      <Form.FormRow label="Calorías" error={formState.errors.calories}>
        <Input
          disabled={pending}
          name="calories"
          placeholder="Calorías del ingrediente"
        />
      </Form.FormRow>

      <Form.FormRow label="Proteínas" error={formState.errors.protein}>
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
