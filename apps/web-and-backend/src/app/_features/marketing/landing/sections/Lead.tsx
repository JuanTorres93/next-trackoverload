import Section from "../Section";
import Strong from "../Strong";

export default function Lead() {
  return (
    <Section className="bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xl leading-relaxed text-text-minor-emphasis md:text-2xl md:leading-relaxed">
          Si has tenido dificultades para sentirte pleno,{" "}
          <Strong>si has querido verte bien y no has sabido cómo,</Strong> si no
          eres feliz pero sientes que deberías serlo,
        </p>

        <p className="mt-8 text-2xl font-semibold text-text md:text-3xl">
          entonces has llegado al sitio correcto.
        </p>
      </div>
    </Section>
  );
}
