'use client';
import AuthLink from '@/app/_features/auth/AuthLink';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonPrimary from '@/app/_ui/buttons/ButtonPrimary';
import Checkbox from '@/app/_ui/Checkbox';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import PasswordInput from '@/app/_ui/PasswordInput';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import SpinnerMini from '@/app/_ui/SpinnerMini';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { GiPartyPopper } from 'react-icons/gi';
import { IoMdHeart } from 'react-icons/io';

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
  // TODO: delete this when beta-testing is done
  const [showBetaUserLimitError, setShowMaxUsersExceededError] =
    useState(false);

  const router = useRouter();
  const { formState, setField, isLoading, setIsLoading } =
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

        // TODO: delete this when beta-testing is done
        if (errorMessage.includes('beta')) {
          setShowMaxUsersExceededError(true);
          return;
        }

        showErrorToast(errorMessage);

        return;
      }

      // Wait for the new session cookie to be set before refreshing and redirecting
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      router.push('/app/recipes');
    } catch {
      showErrorToast(
        'Error al crear el usuario. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // TODO: delete this when beta-testing is done (relative and overflow-hidden)
    <div className="relative w-full p-10 overflow-hidden rounded-xl max-w-110 bg-text-light">
      <header className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Crea tu cuenta</h2>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormEntry labelText="Nombre" htmlFor="name">
          <Input
            id="name"
            type="text"
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            onChange={(e) => setField('acceptTerms', e.target.checked)}
            required
          />
        </FormEntry>

        <ButtonPrimary className="mt-2" type="submit" disabled={isFormInvalid}>
          {isLoading && <SpinnerMini className="mx-auto" />}
          {!isLoading && 'Registrarse'}
        </ButtonPrimary>
      </form>

      <h3 className="mt-4 text-sm text-center">
        ¿Ya tienes una cuenta?{' '}
        <AuthLink className="inline" href="/auth/login">
          Inicia sesión
        </AuthLink>
      </h3>

      {/* TODO: delete this when beta-testing is done */}
      {showBetaUserLimitError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-error to-error/80 text-text-light">
          <div className="max-w-md p-8 text-center border shadow-2xl bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
            <div className="flex justify-center mb-6">
              <div className="relative p-4 rounded-full bg-white/20">
                <FiUsers className="text-6xl" />
                <GiPartyPopper className="absolute text-4xl text-yellow-300 -top-2 -right-2" />
              </div>
            </div>

            <h3 className="mb-3 text-2xl font-bold">
              ¡Fase de pruebas en curso! 🎉
            </h3>

            <p className="mb-4 text-lg opacity-90">
              Ya se han registrado todos los usuarios de prueba que necesitaba.
            </p>

            <p className="mb-6 text-lg font-light">
              <span className="italic">
                Espero verte cuando haya terminado esta fase
              </span>{' '}
              😄
            </p>

            <div className="flex items-center justify-center gap-3 px-6 py-3 text-base bg-white/15 rounded-xl">
              <IoMdHeart className="text-xl text-red-200" />
              <span>¡Gracias por tu interés!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
