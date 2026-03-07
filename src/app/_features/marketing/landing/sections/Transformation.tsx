import BeforeAfter from '../BeforeAfter';
import Section from '../Section';
import SectionHeading from '../SectionHeading';

import afterImage from '@/../public/after.jpg';
import beforeImage from '@/../public/before.jpg';

function Transformation() {
  return (
    <Section className="bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeading subtitle="Queda a tu criterio.">
          Pero... ¿esto funciona?
        </SectionHeading>

        <BeforeAfter
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeLabel="Antes (2021)"
          afterLabel="Después (2025)"
          className="mb-8"
        />

        <div className="mx-auto prose prose-lg text-left text-text-minor-emphasis">
          <p>
            Pero te digo que sí. Y lo hace porque está basado en la ciencia y en
            experiencias reales. Se fundamenta en estudios y años de ensayo y
            error.
          </p>

          <p>
            La diferencia temporal entre ambas fotos es de 4 años. No obstante,
            durante ese tiempo estaba aprendiendo y haciendo muchas cosas mal.
            Si tu objetivo es perder grasa, entonces verás resultados mucho
            antes porque es un proceso biológico más rápido que la ganancia
            muscular.
          </p>

          <p>
            El método que uso funciona, pero tienes que seguirlo. Y es ahí donde
            entra Cimientos. Es mi forma de ponértelo lo más fácil que pueda.
          </p>

          <p>
            A mí, saber que algo funciona me da tranquilidad. Si tengo esa
            certeza y sé que lo único que necesito es hacerlo y tiempo, entonces
            la ansiedad se reduce mucho porque sé que voy a llegar. Antes o
            después, pero voy a llegar.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default Transformation;

{
  /* Pero... ¿esto funciona? */
}
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
        experiencias reales. Se fundamenta en estudios y años de ensayo y error.
      </p>

      <p>
        La diferencia temporal entre ambas fotos es de 4 años. No obstante,
        durante ese tiempo estaba aprendiendo y haciendo muchas cosas mal. Si tu
        objetivo es perder grasa, entonces verás resultados mucho antes porque
        es un proceso biológico más rápido que la ganancia muscular.
      </p>

      <p>
        El método que uso funciona, eso te lo puedo garantizar. Pero tienes que
        seguirlo, y es ahí donde entra Cimientos. Es mi forma de ponértelo lo
        más fácil que pueda.
      </p>

      <p>
        A mí, saber que algo funciona me da tranquilidad. Si tengo esa certeza y
        sé que lo único que necesito es hacerlo y tiempo, entonces la ansiedad
        se reduce mucho porque sé que voy a llegar. Antes o después, pero voy a
        llegar.
      </p>
    </div>
  </div>
</Section>;
