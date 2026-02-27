import ButtonPrimary from './_ui/ButtonPrimary';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function LandingPage() {
  return (
    <div>
      <main>
        Landing page aún por construir
        <div className="flex gap-4 mt-4">
          <ButtonPrimary href="/app">Ir a la app</ButtonPrimary>

          <ButtonPrimary href="/auth/register">Registrase</ButtonPrimary>
        </div>
      </main>
    </div>
  );
}
