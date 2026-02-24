'use client';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import PasswordInput from '@/app/_ui/PasswordInput';
import AuthLink from '@/app/auth/common/AuthLink';
import AuthSpinner from '@/app/auth/common/AuthSpinner';

export type LoginFormState = {
  email: string;
  password: string;
};

const INITIAL_FORM_STATE: LoginFormState = {
  email: '',
  password: '',
};

function LoginForm() {
  const { formState, setField, isLoading, setIsLoading, resetForm } =
    useFormSetup<LoginFormState>(INITIAL_FORM_STATE);

  const isFormInvalid = !formState.email || !formState.password || isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      // TODO: Run login logic

      resetForm();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full p-10 rounded-xl max-w-110 bg-text-light">
      <header className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Inicia sesión</h2>

        <h3 className="text-sm ">
          ¿No tienes una cuenta?{' '}
          <AuthLink className="inline" href="/auth/register">
            Regístrate
          </AuthLink>
        </h3>
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

        <FormEntry labelText="Contraseña" htmlFor="password">
          <PasswordInput
            id="password"
            type="password"
            placeholder="Contr@s3ña"
            value={formState.password}
            onChange={(e) => setField('password', e.target.value)}
            required
          />
        </FormEntry>

        <ButtonPrimary className="mt-2" type="submit" disabled={isFormInvalid}>
          {isLoading && <AuthSpinner />}
          {!isLoading && 'Iniciar sesión'}
        </ButtonPrimary>
      </form>
    </div>
  );
}

export default LoginForm;
