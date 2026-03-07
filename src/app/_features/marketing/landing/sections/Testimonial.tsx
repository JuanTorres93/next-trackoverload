import { FaQuoteLeft } from 'react-icons/fa';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

export default function Testimonial() {
  return (
    <Section className="overflow-hidden bg-gradient-to-b from-white to-surface-light">
      <div className="max-w-4xl mx-auto">
        <SectionHeading subtitle="Lo que dice alguien que ya ha pasado por esto">
          La experiencia de un amigo
        </SectionHeading>

        {/* Tarjeta de testimonio */}
        <div className="relative mt-12">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 rounded-full w-96 h-96 bg-primary/5 blur-3xl" />
          </div>

          {/* Contenido principal */}
          <div className="relative p-8 bg-white shadow-xl rounded-3xl md:p-12">
            {/* Icono de comillas */}
            <div className="absolute top-8 right-8 text-primary/10">
              <FaQuoteLeft className="w-16 h-16 md:w-20 md:h-20" />
            </div>

            {/* Testimonio con mejor tipografía */}
            <div className="relative space-y-6 text-text">
              <p className="text-lg leading-relaxed md:text-xl">
                &quot;Durante mucho tiempo, quise ganar masa muscular, pero no
                sabía por dónde empezar. Afortunadamente, un amigo con
                experiencia en el tema me guió en cada paso. Me explicó los
                fundamentos de la hipertrofia: desde cómo estructurar mis
                entrenamientos y ajustar las series y repeticiones, hasta cómo
                enfocarme en el principio de
                <span className="font-semibold text-primary">
                  {' '}
                  &apos;una repetición más&apos;
                </span>
                .
              </p>

              <p className="text-lg leading-relaxed md:text-xl">
                Además, me ayudó a estructurar mi alimentación para optimizar el
                crecimiento muscular. Aprendí a ajustar mi ingesta de proteínas
                y planificar mis comidas a lo largo del día para alimentar
                correctamente mi cuerpo.
              </p>

              <p className="text-lg leading-relaxed md:text-xl">
                Gracias a su ayuda, ahora sigo una rutina completa que incluye
                tanto ejercicios básicos como específicos para cada grupo
                muscular, y que me reta constantemente. Estoy muy agradecido de
                tener a alguien que me haya mostrado el camino de forma tan
                práctica y motivadora.&quot;
              </p>
            </div>

            {/* Autor con más estilo */}
            <div className="flex items-center gap-6 pt-8 mt-8 border-t border-gray-100">
              {/* Avatar con gradiente si no hay foto */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-br from-primary to-primary-light blur-md" />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary-light">
                  <span className="text-2xl font-bold text-white">A</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-bold text-text">Amigo anónimo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
