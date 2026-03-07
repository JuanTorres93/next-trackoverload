import BeforeAfter from '@/app/_features/marketing/landing/BeforeAfter';
import ButtonCTA from '@/app/_features/marketing/landing/ButtonCTA';
import FeatureList from '@/app/_features/marketing/landing/FeatureList';
import Hero from '@/app/_features/marketing/landing/Hero';
import PricingCard from '@/app/_features/marketing/landing/PricingCard';
import Section from '@/app/_features/marketing/landing/Section';
import SectionHeading from '@/app/_features/marketing/landing/SectionHeading';
import { FaArrowRight } from 'react-icons/fa';

// Importa tus imágenes
import afterImage from '@/../public/after.jpg';
import beforeImage from '@/../public/before.jpg';

export default function LandingPage() {
  return (
    <main className="bg-surface-light">
      <Hero />

      {/* ¿Qué hay bajo la inseguridad? */}
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
              ignorarlo completamente. Pero todos los tenemos como una brújula
              que muestra nuestro ser ideal.
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
                Estos sentimientos negativos van formando creencias internas. Y
                es a través de tus creencias que creas tu{' '}
                <span className="text-primary">identidad</span>.
              </p>
            </div>

            <p>
              Si piensas que eres vago, que eres antisocial, que comer sano no
              es para ti, que entrenar no es para ti, entonces vas a creer que
              es cierto. Y lo vas a adoptar como parte de tu identidad.
            </p>

            <p>
              Pero, ¿qué diferencia a una persona que &quot;sí puede
              hacerlo&quot; de ti? Vivimos en el mismo mundo, tenemos un cerebro
              con los mismos años de evolución, tenemos un cuerpo que está
              diseñado para lo mismo. Lo que la diferencia son sus{' '}
              <span className="font-semibold text-primary">creencias</span>.
            </p>

            <p>
              Por el motivo que sea, su vida y sus experiencias le han llevado a
              pensar que esas cosas sí son para ella. Pero eso no significa que
              estés jodido y no tenga solución. Podemos cambiar nuestras
              creencias. No es un proceso rápido, no es un proceso cómodo, pero
              sí es un proceso posible. Y merece la pena.
            </p>

            <p>
              Si construimos nuestra identidad sobre unos cimientos robustos,
              entonces nuestras creencias nos permitirán superar obstáculos. Nos
              haremos cargo de nuestros problemas, sabremos que se pueden
              solucionar y sentiremos que somos capaces de superarlos. Por el
              contrario, si nuestra identidad se asienta sobre unos cimientos
              frágiles, entonces tendremos creencias limitantes que nos
              impedirán actuar acorde a nuestros valores.
            </p>
          </div>
        </div>
      </Section>

      {/* Cómo saber si tus cimientos son frágiles */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading>
            Cómo saber si tus cimientos son frágiles
          </SectionHeading>

          <p className="mb-8 text-lg text-center text-text-minor-emphasis">
            ¿Cómo podemos saber si nuestros cimientos son frágiles? No hay una
            única manera de responder a esta pregunta. Pero comportamientos como
            estos suelen ser síntoma de que pueden mejorar.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 bg-red-50 rounded-2xl">
              <h3 className="mb-4 text-xl font-semibold text-red-600">
                Comportamientos que debilitan
              </h3>
              <FeatureList
                items={[
                  'Criticar a los demás.',
                  'No cuidarte.',
                  'Culpar a otros por tus problemas.',
                  'Tratar tus relaciones como transacciones.',
                  'Querer sentirte pleno sin estar dispuesto a esforzarte.',
                ]}
                variant="default"
              />
              <p className="mt-4 text-sm text-red-600/80">
                Todos estos comportamientos van alimentándose de tu confianza.
                Lo hacen lentamente, pero sin pausa.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-2xl">
              <h3 className="mb-4 text-xl font-semibold text-green-600">
                Comportamientos que fortalecen
              </h3>
              <FeatureList
                items={[
                  'Intentar comprender la situación de la otra persona antes de criticarle.',
                  'Hacerte responsable de tu salud.',
                  'Aceptar que tus problemas son tuyos y no cargar a nadie con ellos.',
                  'Dar sin esperar recibir nada a cambio.',
                  'Estar dispuesto a esforzarte por lo que te importa.',
                ]}
                variant="check"
              />
              <p className="mt-4 text-sm text-green-600/80">
                Estas acciones alimentan las creencias de que eres alguien que
                merece la pena, de que eres alguien capaz de superar problemas.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Los pilares de la felicidad */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading subtitle="Arreglar tus cimientos y convertirlos en algo sólido y robusto es un proceso largo y te va a requerir salir de tu zona de comfort en distintos aspectos de tu vida.">
            Los pilares de la felicidad
          </SectionHeading>

          <FeatureList
            items={[
              'Salud física',
              'Nutrición',
              'Salud mental',
              'Amistad',
              'Amor',
            ]}
            variant="pill"
            className="mb-8"
          />

          <p className="text-text-minor-emphasis">
            Todos y cada uno de ellos son un buen punto de partida. Y por todos
            y cada uno de ellos merece la pena esforzarse. En su día, empecé por
            el pilar de la salud física. No porque supiera nada sobre estos
            conceptos, ni mucho menos. Simplemente supe que era algo en lo que
            tenía que empezar a trabajar.
          </p>

          <div className="p-6 mt-8 bg-primary/5 rounded-2xl">
            <p className="font-medium text-text">
              Lo bueno de empezar por la salud física es que dependes
              exclusivamente de ti. A diferencia de otros pilares como la
              amistad o amor, no requieres de nadie para conseguirlo. Por eso
              creo que empezar a trabajar en tu salud física es el punto de
              entrada más fácil para empezar a sentirte pleno.
            </p>
          </div>
        </div>
      </Section>

      {/* Cómo superar el odio a entrenar */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeading>Cómo superar el odio a entrenar</SectionHeading>

          <div className="prose prose-lg text-text-minor-emphasis">
            <p>
              El primer cimiento para una buena salud física es el ejercicio. Y
              para mí fue una putada, porque NUNCA me había gustado hacer
              ejercicio. Siempre lo había odiado con pasión, solo de pensar en
              ponerme a entrenar me cansaba. Era vago hasta la médula y, por
              alto que fuera el incentivo, no conseguía (ni quería) ponerme a
              entrenar.
            </p>

            <p>
              Había adoptado la pereza como una parte integral de mi identidad.
              Yo quería ser fuerte, pero no estaba dispuesto a poner el esfuerzo
              necesario para conseguirlo. Además, de cara al exterior lo negaba,
              decía que era algo que no me interesaba.
            </p>

            <div className="p-6 my-8 border-l-4 bg-primary/5 rounded-2xl border-primary">
              <p className="italic text-text">
                &quot;Por suerte, cuando estudiaba en la universidad me llevé un
                toque de atención. Estábamos en época de extraordinarios y yo
                iba a estudiar a la facultad... Un día fui a subir por las
                escaleras al primer piso y al terminar llegué sin aliento. Yo
                tendría unos 24 años. Ese cansancio no era algo que debería
                sentir por tan poco esfuerzo.&quot;
              </p>
            </div>

            <p>
              Ese fue el momento en el que tomé la decisión: &quot;en cuanto
              termine los exámenes me pongo a hacer ejercicio, esta vez en
              serio&quot;. Y así fue, desde entonces he entrenado fuerza de
              forma consistente.
            </p>

            <p>
              Los primeros años odiaba cuando llegaba el día de entrenamiento.
              Me sentía incómodo conmigo mismo: tanto mental, como físicamente.
              Me daba vergüenza que otras personas supieran que estaba
              entrenando, que quería estar bien. Pero luché contra esa
              incomodidad. Tenía un propósito.
            </p>

            <p>
              Estar sano en el largo plazo. Sentirme bien. Que mi cuerpo
              respondiera cuando se lo pidiera. Ese fue el combustible que me
              hizo superar la incomodidad. No fue ser atractivo, no fue estar
              fuerte, sino poder funcionar como persona y estar bien.
            </p>

            <p>
              Viéndolo en retrospectiva, tuve una fuerza de voluntad de caballo.
              El proceso no era fácil de seguir y, además, no veía progreso. Fue
              exclusivamente la fuerza de voluntad lo que me hizo no rendirme y
              persistir durante todo ese tiempo.
            </p>

            <p>
              Pero con los años he aprendido. Me he adaptado y he descubierto un
              método con el que se puede ser consistente sin depender en exceso
              de la fuerza de voluntad. No te voy a engañar: va a seguir siendo
              incómodo y difícil, sobre todo si no has entrenado nunca. Pero el
              sufrimiento es personalizable y, además, se ve progreso desde el
              principio, lo que ayuda a ser consistente. Es el método de{' '}
              <span className="font-semibold text-primary">
                &quot;una repetición más&quot;
              </span>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* Mi razón para mejorar mi alimentación */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeading>Mi razón para mejorar mi alimentación</SectionHeading>

          <div className="prose prose-lg text-text-minor-emphasis">
            <p>
              El otro cimiento para una gran salud física es la nutrición. Una
              buena nutrición, como todo lo que merece la pena, brilla en el
              largo plazo. El cambio a comer sano es duro, pero se puede hacer
              de forma gradual. Además, comer sano no implica dejar de comer
              cosas no sanas: tan sólo debemos hacerlo con cabeza y siendo
              conscientes de nuestros objetivos.
            </p>

            <p>
              Al igual que con el ejercicio, nunca me había interesado la
              nutrición. Y, a diferencia del ejercicio, la razón por la que lo
              hice no fue la salud, sino verme fuerte. Después de ser
              consistente entrenando durante unos cuantos años, ya me apetecía
              verme con un buen cuerpo. Me sentía bien, pero no parecía que
              llevara años entrenando.
            </p>

            <p>
              Ahí me empecé a interesar por la ganancia muscular. Había
              escuchado que la nutrición era muy importante para conseguir
              músculo, pero me daba igual. Por algún motivo yo asumía que
              entrenar duro sería suficiente para desarrollar músculo y verme
              fuerte. La biología pensaba diferente, así que empecé a cambiar mi
              dieta.
            </p>

            <p>
              Las recomendaciones eran comer más calorías de las que gastas y
              suficiente proteína. Las calorías son para que tu cuerpo tenga
              energía de sobra. Así podrá gastarla en crear músculo, pues tus
              necesidades vitales estarán ya cubiertas. Las proteínas, por su
              parte, son para tener los bloques de construcción necesarios para
              crear músculo.
            </p>

            <p>
              Empecé a pesar todo lo que comía, pero me aburrí más pronto que
              tarde, era un suplicio tener que estar pesando siempre todo lo que
              comía. Esa época no duró mucho.
            </p>

            <p>
              Siendo ingeniero, sé que las aproximaciones son muy útiles. En la
              mayoría de escenarios no hace falta tener un número exacto para
              que las cosas funcionen, basta con tener una aproximación lo
              suficientemente cercana.
            </p>

            <div className="p-6 my-8 bg-primary/5 rounded-2xl">
              <p className="font-medium text-text">
                Así que mi enfoque cambió. Ya no pesaba todo lo que comía, me
                empecé a hacer un recetario. Iba apuntando recetas con sus
                cantidades para hacer cada comida. Y calculaba los números una
                sola vez. De esta forma, cada vez que hiciera esa comida sabría
                inmediatamente sus calorías y proteínas. Sin necesidad de
                pesarlo todo.
              </p>
            </div>

            <p>
              Ahora lo único que quedaba por hacer era planificar estas comidas
              a lo largo de la semana y seguir el plan. Así cumpliría los
              objetivos de calorías y proteínas.
            </p>

            <p>
              A mí no me gusta cocinar, así que lo hago una vez a la semana.
              Cocino dos recetas distintas: una para comer y otra para cenar. De
              esta manera es muy fácil cumplir con los números. Pero no es la
              única forma de hacerlo. Cada uno puede (y debe) ajustarlo a su
              vida y sus preferencias.
            </p>

            <p>
              Puedes comer lo que quieras, lo importante es saber las
              estimaciones y cumplirlas. Y esto sirve tanto para ganar músculo,
              como para perder grasa.
            </p>

            <p>
              El problema que yo encontré es que, en la mayoría de aplicaciones,
              el registrar comidas era muy tedioso. Había que ir día por día y
              era tedioso. Y, además, aportaban mucha información superflua que
              sólo incomodaba.
            </p>

            <p>
              Por eso decidí crear Cimientos. Es una forma de centrarte sólo en
              lo que importa para el proceso: calorías y proteínas. El resto de
              nutrientes y macronutrientes no van a suponer un problema si
              llevamos una dieta equilibrada. Nunca he registrado los
              carbohidratos ni las grasas. No creo que tenga sentido para la
              gente que no sea atleta profesional. Y he visto buenos resultados
              sin hacerlo.
            </p>
          </div>
        </div>
      </Section>

      {/* Pero... ¿esto funciona? */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading subtitle="Queda a tu criterio.">
            Pero... ¿esto funciona?
          </SectionHeading>

          <BeforeAfter
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="Antes (2019)"
            afterLabel="Después (2023)"
            className="mb-8"
          />

          <div className="mx-auto prose prose-lg text-left text-text-minor-emphasis">
            <p>
              Sí funciona. Y lo hace porque está basado en la ciencia y en
              experiencias reales. Se fundamenta en estudios y años de ensayo y
              error.
            </p>

            <p>
              La diferencia temporal entre ambas fotos es de 4 años. No
              obstante, durante ese tiempo estaba aprendiendo y haciendo muchas
              cosas mal. Si tu objetivo es perder grasa, entonces verás
              resultados mucho antes porque es un proceso biológico más rápido
              que la ganancia muscular.
            </p>

            <p>
              El método que uso funciona, eso te lo puedo garantizar. Pero
              tienes que seguirlo, y es ahí donde entra Cimientos. Es mi forma
              de ponértelo lo más fácil que pueda.
            </p>

            <p>
              A mí, saber que algo funciona me da tranquilidad. Si tengo esa
              certeza y sé que lo único que necesito es hacerlo y tiempo,
              entonces la ansiedad se reduce mucho porque sé que voy a llegar.
              Antes o después, pero voy a llegar.
            </p>
          </div>
        </div>
      </Section>

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
      {/* Empieza tu cambio hoy */}
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
            Si te interesa sólo tienes que registrarte gratis pulsando este
            botón.
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
            Cuando termine el registro podrás empezar a crear tus recetas
            leyendo códigos de barras. Y cuando tengas un par creadas, entonces
            podrás empezar a planificar tus semanas y registrar tus comidas.
          </p>

          <p className="mt-12 text-2xl font-light text-white/90">
            Espero que te sirva y te ayude a ser más feliz.
          </p>

          <p className="mt-4 text-3xl font-semibold">Un abrazo! 🤗</p>
        </div>
      </Section>
    </main>
  );
}
