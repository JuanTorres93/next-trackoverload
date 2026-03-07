import { FaArrowRight } from 'react-icons/fa';
import ButtonCTA from '../ButtonCTA';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

function Response() {
  return (
    <Section className="relative overflow-hidden bg-primary">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center text-white">
        <SectionHeading className="!text-white">
          Empieza tu cambio hoy
        </SectionHeading>

        <p className="mb-8 text-xl text-white/90">
          Si te interesa sólo tienes que registrarte gratis pulsando este botón.
        </p>

        <div className="flex justify-center">
          <ButtonCTA
            href="/auth/register"
            className="!bg-white !text-primary hover:!bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              Registrarme gratis
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </ButtonCTA>
        </div>

        <p className="mt-8 text-white/80">
          Cuando termine el registro podrás empezar a crear tus recetas leyendo
          códigos de barras. Y cuando tengas un par creadas, entonces podrás
          empezar a planificar tus semanas y registrar tus comidas.
        </p>

        <p className="mt-12 text-2xl font-light text-white/90">
          Espero que te sirva y te ayude a ser más feliz.
        </p>

        <p className="mt-4 text-3xl font-semibold">Un abrazo! 🤗</p>
      </div>
    </Section>
  );
}

export default Response;
