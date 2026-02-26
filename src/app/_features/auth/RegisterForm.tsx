'use client';
import AuthLink from '@/app/_features/auth/AuthLink';
import AuthSpinner from '@/app/_features/auth/AuthSpinner';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Checkbox from '@/app/_ui/Checkbox';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import PasswordInput from '@/app/_ui/PasswordInput';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { useRouter } from 'next/navigation';

export type RegisterFormState = {
  name: string;
  email: string;
  plainPassword: string;
  acceptTerms: boolean;
};

const INITIAL_FORM_STATE: RegisterFormState = {
  name: '',
  email: '',
  plainPassword: '',
  acceptTerms: false,
};

function RegisterForm() {
  const router = useRouter();
  const { formState, setField, isLoading, setIsLoading, resetForm } =
    useFormSetup<RegisterFormState>(INITIAL_FORM_STATE);

  const isFormInvalid =
    !formState.name ||
    !formState.email ||
    !formState.plainPassword ||
    !formState.acceptTerms ||
    isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
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
            : jsonResponse.message || 'Error al crear el usuario.';

        showErrorToast(errorMessage);

        return;
      }

      resetForm();
      // Refresh for cookies to be correctly updated
      router.refresh();
      router.push('/app');
    } catch {
      showErrorToast(
        'Error al crear el usuario. Por favor, inténtalo de nuevo.',
      );
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
        <FormEntry labelText="Nombre" htmlFor="name">
          <Input
            id="name"
            type="text"
            value={formState.name}
            placeholder="Nombre"
            onChange={(e) => setField('name', e.target.value)}
            required
          />
        </FormEntry>

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

        <FormEntry labelText="Contraseña" htmlFor="plainPassword">
          <PasswordInput
            id="plainPassword"
            type="password"
            placeholder="Contr@s3ña"
            value={formState.plainPassword}
            onChange={(e) => setField('plainPassword', e.target.value)}
            required
          />
        </FormEntry>

        <FormEntry
          labelText={
            <span>
              Acepto los{' '}
              <AuthLink href="/legal/terms-and-conditions" target="_blank">
                términos y condiciones
              </AuthLink>
            </span>
          }
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
