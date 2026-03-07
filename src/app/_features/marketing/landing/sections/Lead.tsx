import Section from '../Section';

export default function Lead() {
  return (
    <Section className="bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-2xl leading-relaxed text-text md:text-3xl md:leading-relaxed">
          Si has tenido dificultades para sentirte pleno,
          <br />
          <span className="font-semibold text-primary">
            si has querido verte bien y no has sabido cómo,
          </span>
          <br />
          si no eres feliz pero sientes que deberías serlo,
        </p>

        <p className="mt-8 text-xl text-text-minor-emphasis md:text-2xl">
          entonces has llegado al sitio correcto.
        </p>
      </div>
    </Section>
  );
}
