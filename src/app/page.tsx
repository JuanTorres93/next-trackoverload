import LandingSection from './_features/marketing/landing/LandingSection';
import LandingSubhead from './_features/marketing/landing/LandingSubhead';
import ButtonPrimary from './_ui/ButtonPrimary';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function LandingPage() {
  return (
    <div>
      <main className="mx-auto max-w-[90rem] bg-surface-light">
        <div className="grid h-screen grid-cols-1 gap-0 auto-rows-min">
          <ButtonPrimary href="/app">Ir a la app</ButtonPrimary>

          <ButtonPrimary href="/auth/register">Registrase</ButtonPrimary>

          <LandingSection>
            <LandingSubhead>Qué te hace sentir incapaz</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Construye una nueva identidad</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Por qué no hay que hacerlo perfecto</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>
              Crea tu propio método durante el camino
            </LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Construye disciplina paso a paso</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Forja tu propio camino</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Diseñada para ser simple</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>El fracaso no existe</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Empieza tu cambio hoy</LandingSubhead>
          </LandingSection>
        </div>
      </main>
    </div>
  );
}
