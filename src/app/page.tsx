import LandingSubhead from './_features/marketing/landing/LandingSubhead';
import ButtonPrimary from './_ui/ButtonPrimary';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function LandingPage() {
  return (
    <div>
      <main className="mx-auto max-w-[90rem] bg-surface-light px-6">
        <div className="grid h-screen grid-cols-1 gap-4 auto-rows-min">
          <ButtonPrimary href="/app">Ir a la app</ButtonPrimary>

          <ButtonPrimary href="/auth/register">Registrase</ButtonPrimary>

          <LandingSubhead>Qué te hace sentir incapaz</LandingSubhead>

          <LandingSubhead>Construye una nueva identidad</LandingSubhead>

          <LandingSubhead>Por qué no hay que hacerlo perfecto</LandingSubhead>

          <LandingSubhead>
            Crea tu propio método durante el camino
          </LandingSubhead>

          <LandingSubhead>Construye disciplina paso a paso</LandingSubhead>

          <LandingSubhead>Forja tu propio camino</LandingSubhead>

          <LandingSubhead>Diseñada para ser simple</LandingSubhead>

          <LandingSubhead>El fracaso no existe</LandingSubhead>

          <LandingSubhead>Empieza tu cambio hoy</LandingSubhead>
        </div>
      </main>
    </div>
  );
}
