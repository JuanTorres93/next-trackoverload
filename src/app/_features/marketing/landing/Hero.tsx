import heroImage from '@/../public/hero.webp';
import Image from 'next/image';
import ButtonCTA from './ButtonCTA';

function Hero() {
  return (
    <section className="relative w-full min-h-[85dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with subtle zoom animation */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-[20s]"
        />
      </div>

      {/* Gradient Overlay instead of solid black - more elegant */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/70" />

      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-30" />
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-20 text-center text-white sm:px-6">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full border-white/20 backdrop-blur-sm bg-white/10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase text-white/90">
            ¿Falta de autoestima?
          </span>
        </div>

        {/* Main headline with improved typography */}
        <h1 className="max-w-4xl mx-auto text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          <span className="block">Si puedes mejorar tus cimientos,</span>
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
            puedes ganar confianza.
          </span>
        </h1>

        {/* Divider line with gradient */}
        <div className="w-24 h-1 mx-auto my-8 rounded-full bg-gradient-to-r from-primary via-primary-light to-primary" />

        {/* Content card with backdrop blur */}
        <div className="max-w-2xl mx-auto">
          <p className="text-lg font-medium text-white/90 md:text-xl">
            Si sigues leyendo, aprenderás:
          </p>

          {/* List with improved visual hierarchy */}
          <ul className="mt-8 space-y-5 text-base text-left md:text-lg">
            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                Dónde nace tu insatisfacción.
              </span>
            </li>

            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                Acciones inconscientes que reducen tu confianza.
              </span>
            </li>

            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                Cuáles son los pilares de la felicidad.
              </span>
            </li>

            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                Cómo alguien que odiaba moverse hizo del ejercicio su nueva
                forma de vida.
              </span>
            </li>

            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                La razón por la que empecé a cuidar mi alimentación.
              </span>
            </li>

            <li className="flex gap-4 p-3 -m-3 transition-all duration-300 group rounded-xl hover:bg-white/5 hover:backdrop-blur-sm">
              <span className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 mt-0.5">
                  <span className="w-2 h-2 transition-all duration-300 rounded-full bg-primary group-hover:scale-125" />
                </span>
              </span>
              <span className="flex-1 transition-colors text-white/90 group-hover:text-white">
                Por qué se puede cambiar tu peso sin ser estricto pesando la
                comida.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA with elevation */}
        <div className="flex justify-center mt-10">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute transition-opacity rounded-full opacity-50 -inset-1 bg-gradient-to-r from-primary to-primary-light blur-xl group-hover:opacity-75" />
            <ButtonCTA
              href="/auth/register"
              className="relative !bg-primary hover:!bg-primary-light text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            >
              Empieza ahora
            </ButtonCTA>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute hidden w-32 h-32 border rounded-full top-20 left-10 border-white/10 animate-pulse lg:block" />
        <div className="absolute hidden w-24 h-24 delay-700 border rounded-full bottom-20 right-10 border-white/10 animate-pulse lg:block" />
      </div>
    </section>
  );
}

export default Hero;
