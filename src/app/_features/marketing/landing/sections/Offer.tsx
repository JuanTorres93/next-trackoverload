import PricingCard from '../PricingCard';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

function Offer() {
  return (
    <>
      {/* Qué esperar de Cimientos */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading subtitle="Cimientos es una herramienta simple. Su función es registrar lo que importa para conseguir un cambio físico: calorías, proteína y ejercicio.">
            Qué esperar de Cimientos
          </SectionHeading>

          <div className="mx-auto prose prose-lg text-text-minor-emphasis">
            <p>
              La he diseñado para que sea sencilla y rápida de utilizar. Si
              quieres dar un paso hacia tu felicidad, un muy buen paso para
              empezar es cuidar tu cuerpo. Al fin y al cabo es donde vas a vivir
              el resto de tu vida. Cuanto mejor sea su condición, más potencial
              tendrás para crecer y ser feliz.
            </p>

            <p>
              Quiero que si te decides a usar Cimientos, que sea porque te
              aporta valor. Quiero también que no tengas nada que perder por
              darle una oportunidad. Por eso te doy 14 días gratis, sin pedir
              ningún método de pago.
            </p>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section className="bg-gradient-to-b from-white to-surface-light">
        <div className="max-w-5xl mx-auto">
          <SectionHeading subtitle="Trabajo sólo en este proyecto y quiero vivir de él, así que los únicos gastos que tengo son de infraestructura y de vida.">
            Precio transparente
          </SectionHeading>

          <div className="flex justify-center mt-12">
            <div className="w-full max-w-md">
              <PricingCard
                title="Cimientos"
                price="2€"
                description="Todo lo que necesitas para empezar tu cambio"
                features={[
                  'Registro de calorías y proteínas',
                  'Escaneo de códigos de barras',
                  'Planificador de comidas semanal',
                  'Recetario personal',
                  'Seguimiento de progreso',
                  '14 días gratis, sin tarjeta',
                ]}
                ctaText="Empieza gratis"
                ctaHref="/auth/register"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default Offer;
