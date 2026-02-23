'use client';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import Link from 'next/link';

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
          <Link className="inline" href="/auth/register">
            Regístrate
          </Link>
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
          />
        </FormEntry>

        <FormEntry labelText="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={formState.password}
            onChange={(e) => setField('password', e.target.value)}
          />
        </FormEntry>

        <ButtonPrimary className="mt-2" type="submit">
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </ButtonPrimary>
      </form>
    </div>
  );
}

export default LoginForm;
