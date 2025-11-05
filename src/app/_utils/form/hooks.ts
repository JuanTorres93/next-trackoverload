import { useActionState, useEffect, useRef, useTransition } from 'react';
import { FormState } from '../../_types/FormState';
import { initialFormState as InitialFormState } from './forms';

type ResetReactState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setter: (value: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any;
};

export function useResetOnSuccess(
  formRef: React.RefObject<HTMLFormElement | null>,
  formState: FormState,
  pending: boolean,
  reactStatesToReset?: ResetReactState[]
) {
  const prevPendingRef = useRef(pending);

  return useEffect(() => {
    // Only reset when pending changes from true to false (submission completed)
    const wasSubmitting = prevPendingRef.current && !pending;
    prevPendingRef.current = pending;

    if (wasSubmitting && formState.ok && formRef) {
      formRef.current?.reset();

      if (reactStatesToReset) {
        reactStatesToReset.forEach(({ setter, initialValue }) => {
          setter(initialValue);
        });
      }
    }
  }, [pending, formState.ok, formRef, reactStatesToReset]);
}

export function useFormSetup(
  serverAction: (
    initialState: FormState,
    formData: FormData
  ) => Promise<FormState>
) {
  const initialFormState: FormState = InitialFormState();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [formState, formAction] = useActionState(
    serverAction,
    initialFormState
  );

  return { formRef, pending, startTransition, formState, formAction };
}
