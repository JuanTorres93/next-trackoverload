'use client';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import PasswordInput from '@/app/_ui/PasswordInput';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import AuthLink from '@/app/_features/auth/AuthLink';
import AuthSpinner from '@/app/_features/auth/AuthSpinner';
import { useRouter } from 'next/navigation';

export type LoginFormState = {
  email: string;
  plainPassword: string;
};

const INITIAL_FORM_STATE: LoginFormState = {
  email: '',
  plainPassword: '',
};

function LoginForm() {
  const router = useRouter();
  const { formState, setField, isLoading, setIsLoading, resetForm } =
    useFormSetup<LoginFormState>(INITIAL_FORM_STATE);

  const isFormInvalid =
    !formState.email || !formState.plainPassword || isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const jsonResponse = await response.json();

        const errorMessage =
          jsonResponse.status === 'fail'
            ? Object.values(jsonResponse.data).join(' ')
            : jsonResponse.message || 'Error al iniciar sesión.';

        showErrorToast(errorMessage);
        return;
      }

      resetForm();
      router.push('/app');
    } catch {
      showErrorToast('Error al iniciar sesión. ');
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
            value={formState.plainPassword}
            onChange={(e) => setField('plainPassword', e.target.value)}
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
