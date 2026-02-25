import ButtonPrimary from './_ui/ButtonPrimary';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function LandingPage() {
  return (
    <div className="">
      <main className="">
        Landing page aún por construir
        <div className="flex gap-4 mt-4">
          <ButtonPrimary href="/app" className="">
            Ir a la app
          </ButtonPrimary>

          <ButtonPrimary href="/auth/register" className="">
            Registrase
          </ButtonPrimary>
        </div>
      </main>
    </div>
  );
}
