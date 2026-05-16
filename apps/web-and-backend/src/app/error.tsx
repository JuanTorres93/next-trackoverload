'use client';

import ButtonPrimary from './_ui/buttons/ButtonPrimary';
import ButtonSecondary from './_ui/buttons/ButtonSecondary';
import StatusPage from './_ui/StatusPage';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  void error;

  return (
    <StatusPage
      code="500"
      title="Ha habido un problema al cargar esta página"
      description="A veces pasa. Puedes probar de nuevo o volver al dashboard para seguir usando la aplicación con normalidad."
      accentClassName="text-text"
      actions={
        <>
          <ButtonPrimary onClick={() => reset()}>Reintentar</ButtonPrimary>
          <ButtonSecondary href="/app">Ir al dashboard</ButtonSecondary>
        </>
      }
    />
  );
}
