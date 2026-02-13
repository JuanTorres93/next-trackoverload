import { useState } from 'react';

export function useFormSetup<T>(initialState: T) {
  type FormErrors = Record<keyof T, string>;

  const [formState, setFormState] = useState<T>(initialState);
  const [formErrors, setFormErrors] = useState<FormErrors>({} as FormErrors);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function setField<FormKey extends keyof T>(key: FormKey, value: T[FormKey]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setFormState(initialState);
    setFormErrors({} as FormErrors);
  }

  return {
    formState,
    setField,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading,
    resetForm,
  };
}
