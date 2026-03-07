import FeatureList from '../FeatureList';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

function Amplify() {
  return (
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
              Todos estos comportamientos van alimentándose de tu confianza. Lo
              hacen lentamente, pero sin pausa.
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
  );
}

export default Amplify;
