import Section from '../Section';
import SectionHeading from '../SectionHeading';
import Strong from '../Strong';
import List from '../List';

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
            Ese es el filtro con el que miramos el mundo. Nuestros{' '}
            <Strong>valores</Strong> nos guían allá donde vamos. Podemos saber
            cuáles son, o podemos ignorarlo completamente. Pero todos los
            tenemos como una brújula que señala nuestro ser ideal.
          </p>
          <p>
            Cuando nuestras acciones se alinean con nuestros valores nos
            sentimos plenos y felices. Cuando se alejan{' '}
            <em>(o van en contra de ellos)</em>, aparece esa incomodidad con
            nosotros mismos. Algunos síntomas de esa falta de alineación con
            nuestros valores son:
          </p>

          <List
            items={[
              'Sentir que no eres capaz de dar dirección a tu vida.',
              'Sentir que nada importa.',
              'No encontrar motivación para seguir con el día a día.',
            ]}
          />

          <div className="p-6 my-8 border border-gray-100 bg-white/50 backdrop-blur-sm rounded-2xl">
            <p className="font-semibold text-text">
              Estos sentimientos negativos van formando creencias internas. Y es
              a través de tus creencias que creas tu <Strong>identidad</Strong>.
            </p>
          </div>
          <p>Si piensas que: </p>

          <List
            items={[
              'Eres vago.',
              'Eres antisocial.',
              'Comer sano no es para ti.',
              'Entrenar no es para ti.',
            ]}
          />

          <p>
            ...entonces vas a creer que es cierto. Y lo vas a adoptar como parte
            de tu identidad.
          </p>

          <p>
            Pero,{' '}
            <em>
              ¿qué diferencia a una persona que &quot;sí puede hacerlo&quot; de
              ti?
            </em>{' '}
          </p>
          <p>
            Vivimos en el mismo mundo, tenemos un cerebro con los mismos años de
            evolución, tenemos un cuerpo que está diseñado para lo mismo.{' '}
          </p>

          <p>
            Lo que la diferencia son sus <Strong>creencias</Strong>.
          </p>

          <p>
            Por el motivo que sea, su vida y sus experiencias le han llevado a
            pensar que esas cosas sí son para ella. Pero eso no significa que
            estés jodido y no tenga solución. <Strong>Podemos</Strong> cambiar
            nuestras creencias.
          </p>

          <p>
            No es un proceso rápido, no es un proceso cómodo, pero sí es un
            proceso posible.{' '}
          </p>

          <p>
            <Strong>Y merece la pena.</Strong>
          </p>

          <p>
            Si construimos nuestra identidad sobre unos cimientos robustos,
            entonces nuestras creencias nos permitirán superar obstáculos. Nos
            haremos cargo de nuestros problemas, sabremos que se pueden
            solucionar y sentiremos que somos capaces de superarlos.{' '}
          </p>

          <p>
            Por el contrario, si nuestra identidad se asienta sobre unos
            cimientos frágiles, entonces tendremos creencias limitantes que nos
            impedirán actuar acorde a nuestros valores.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default Problem;
