'use client';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Checkbox from '@/app/_ui/Checkbox';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import AuthLink from '@/app/auth/common/AuthLink';
import AuthSpinner from '@/app/auth/common/AuthSpinner';

export type RegisterFormState = {
  email: string;
  password: string;
  acceptTerms: boolean;
};

const INITIAL_FORM_STATE: RegisterFormState = {
  email: '',
  password: '',
  acceptTerms: false,
};

function RegisterForm() {
  const { formState, setField, isLoading, setIsLoading, resetForm } =
    useFormSetup<RegisterFormState>(INITIAL_FORM_STATE);

  const isFormInvalid =
    !formState.email ||
    !formState.password ||
    !formState.acceptTerms ||
    isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      // TODO: Run registration logic

      resetForm();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full p-10 rounded-xl max-w-110 bg-text-light">
      <header className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Crea tu cuenta</h2>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormEntry labelText="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={formState.email}
            placeholder="Email"
            onChange={(e) => setField('email', e.target.value)}
            required
          />
        </FormEntry>

        <FormEntry labelText="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={formState.password}
            onChange={(e) => setField('password', e.target.value)}
            required
          />
        </FormEntry>

        <FormEntry
          labelText="Acepto los términos y condiciones"
          htmlFor="acceptTerms"
          setHorizontal
          reverseLabelOrder
        >
          <Checkbox
            id="acceptTerms"
            checked={formState.acceptTerms}
            onChange={(e) => setField('acceptTerms', e.target.checked)}
            required
          />
        </FormEntry>

        <ButtonPrimary className="mt-2" type="submit" disabled={isFormInvalid}>
          {isLoading && <AuthSpinner />}
          {!isLoading && 'Registrarse'}
        </ButtonPrimary>
      </form>

      <h3 className="mt-4 text-sm text-center">
        ¿Ya tienes una cuenta?{' '}
        <AuthLink className="inline" href="/auth/login">
          Inicia sesión
        </AuthLink>
      </h3>
    </div>
  );
}

export default RegisterForm;
