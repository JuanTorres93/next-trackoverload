import { FormState } from '../../_types/FormState';

export function initialFormState(): FormState {
  const initialFormState: FormState = {
    ok: false,
    errors: {},
    message: null,
  };

  return initialFormState;
}
