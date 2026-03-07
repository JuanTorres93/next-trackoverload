import FeatureList from '../FeatureList';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

function Story() {
  return (
    <>
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
    </>
  );
}

export default Story;
