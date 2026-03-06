import LandingSection from './_features/marketing/landing/LandingSection';
import LandingSubhead from './_features/marketing/landing/LandingSubhead';
import ButtonPrimary from './_ui/ButtonPrimary';

export default function LandingPage() {
  return (
    <div>
      <main className="mx-auto max-w-[90rem] bg-surface-light">
        <div className="grid h-screen grid-cols-1 gap-0 auto-rows-min">
          <ButtonPrimary href="/app">Ir a la app</ButtonPrimary>

          <ButtonPrimary href="/auth/register">Registrase</ButtonPrimary>

          <LandingSection>
            <LandingSubhead>¿Qué hay bajo la inseguridad?</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>
              Cómo saber si tus cimientos son frágiles
            </LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Los pilares de la felicidad</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Cómo superar el odio a entrenar</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>
              Mi razón para mejorar mi alimentación
            </LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Pero... ¿esto funciona?</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Qué esperar de Cimientos</LandingSubhead>
          </LandingSection>

          <LandingSection>
            <LandingSubhead>Empieza tu cambio hoy</LandingSubhead>
          </LandingSection>
        </div>
      </main>
    </div>
  );
}
