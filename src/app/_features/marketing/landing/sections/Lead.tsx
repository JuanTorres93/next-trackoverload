import Section from "../Section";
import Strong from "../Strong";

export default function Lead() {
  return (
    <Section className="bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-2xl leading-relaxed text-text md:text-3xl md:leading-relaxed">
          Si has tenido dificultades para sentirte pleno,
          <br />
          <Strong>si has querido verte bien y no has sabido cómo,</Strong>
          <br />
          si no eres feliz pero sientes que deberías serlo,
        </p>

        <div className="w-10 h-px mx-auto my-8 bg-border" />

        <p className="text-xl italic text-text-minor-emphasis md:text-2xl">
          entonces has llegado al sitio correcto.
        </p>
      </div>
    </Section>
  );
}
