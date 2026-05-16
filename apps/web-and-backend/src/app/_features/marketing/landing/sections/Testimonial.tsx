import { FaQuoteLeft } from "react-icons/fa";

import Section from "../Section";
import SectionHeading from "../SectionHeading";
import Strong from "../Strong";

export default function Testimonial() {
  return (
    <Section className="overflow-hidden bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading subtitle="Lo que dice alguien que ya ha pasado por esto">
          La experiencia de un amigo
        </SectionHeading>

        <div className="relative p-8 bg-white border border-stone-200 rounded-3xl shadow-sm md:p-12">
          {/* Icono de comillas */}
          <div className="absolute top-8 right-8 text-primary/10">
            <FaQuoteLeft className="w-16 h-16 md:w-20 md:h-20" />
          </div>

          <div className="relative space-y-6 text-text-minor-emphasis">
            <p className="text-lg leading-relaxed md:text-xl">
              &quot;Durante mucho tiempo, quise ganar masa muscular, pero no
              sabía por dónde empezar. Afortunadamente, un amigo con experiencia
              en el tema me guió en cada paso. Me explicó los fundamentos de la
              hipertrofia: desde cómo estructurar mis entrenamientos y ajustar
              las series y repeticiones, hasta cómo enfocarme en el principio de
              <Strong> &apos;una repetición más&apos;</Strong>.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              Además, me ayudó a estructurar mi alimentación para optimizar el
              crecimiento muscular. Aprendí a ajustar mi ingesta de proteínas y
              planificar mis comidas a lo largo del día para alimentar
              correctamente mi cuerpo.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              Gracias a su ayuda, ahora sigo una rutina completa que incluye
              tanto ejercicios básicos como específicos para cada grupo
              muscular, y que me reta constantemente.{" "}
              <Strong>Estoy muy agradecido</Strong> de tener a alguien que me
              haya mostrado el camino de forma tan práctica y motivadora.&quot;
            </p>
          </div>

          <div className="flex items-center gap-6 pt-8 mt-8 border-t border-stone-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light shrink-0">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
            <p className="text-xl font-bold text-text">Amigo anónimo</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
