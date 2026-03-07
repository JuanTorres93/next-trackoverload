import Section from '../Section';
import SectionHeading from '../SectionHeading';

function Problem() {
  return (
    <Section className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 rounded-full w-96 h-96 bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <SectionHeading subtitle="Todo se reduce al amor propio. A la percepción que tenemos sobre nosotros mismos.">
          ¿Qué hay bajo la inseguridad?
        </SectionHeading>

        <div className="mx-auto prose prose-lg text-text-minor-emphasis">
          <p>
            Ese es el filtro con el que miramos el mundo. Nuestros valores nos
            guían allá donde vamos. Podemos saber cuáles son, o podemos
            ignorarlo completamente. Pero todos los tenemos como una brújula que
            muestra nuestro ser ideal.
          </p>

          <p>
            Cuando nuestras acciones se alinean con nuestros valores nos
            sentimos plenos y felices. Cuando se alejan (o van en contra de
            ellos), aparece esa incomodidad con nosotros mismos. Sentir que no
            eres capaz de dar dirección a tu vida, sentir que nada importa y
            encontrar motivación para seguir con el día a día, son síntomas de
            falta de alineación con tus valores.
          </p>

          <div className="p-6 my-8 border border-gray-100 bg-white/50 backdrop-blur-sm rounded-2xl">
            <p className="font-semibold text-text">
              Estos sentimientos negativos van formando creencias internas. Y es
              a través de tus creencias que creas tu{' '}
              <span className="text-primary">identidad</span>.
            </p>
          </div>

          <p>
            Si piensas que eres vago, que eres antisocial, que comer sano no es
            para ti, que entrenar no es para ti, entonces vas a creer que es
            cierto. Y lo vas a adoptar como parte de tu identidad.
          </p>

          <p>
            Pero, ¿qué diferencia a una persona que &quot;sí puede hacerlo&quot;
            de ti? Vivimos en el mismo mundo, tenemos un cerebro con los mismos
            años de evolución, tenemos un cuerpo que está diseñado para lo
            mismo. Lo que la diferencia son sus{' '}
            <span className="font-semibold text-primary">creencias</span>.
          </p>

          <p>
            Por el motivo que sea, su vida y sus experiencias le han llevado a
            pensar que esas cosas sí son para ella. Pero eso no significa que
            estés jodido y no tenga solución. Podemos cambiar nuestras
            creencias. No es un proceso rápido, no es un proceso cómodo, pero sí
            es un proceso posible. Y merece la pena.
          </p>

          <p>
            Si construimos nuestra identidad sobre unos cimientos robustos,
            entonces nuestras creencias nos permitirán superar obstáculos. Nos
            haremos cargo de nuestros problemas, sabremos que se pueden
            solucionar y sentiremos que somos capaces de superarlos. Por el
            contrario, si nuestra identidad se asienta sobre unos cimientos
            frágiles, entonces tendremos creencias limitantes que nos impedirán
            actuar acorde a nuestros valores.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default Problem;
