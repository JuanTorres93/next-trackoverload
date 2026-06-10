import Image from "next/image";

import { twMerge } from "tailwind-merge";

import defaultUserPicture from "@/../public/defaultUsserPicture.webp";
import { getLoggedInUser } from "@/app/_features/user/actions";

import ButtonNotifications from "../buttons/ButtonNotifications";
import HeaderContainer from "./HeaderContainer";

function DashboardHeader({
  ...props
}: {} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <HeaderContainer className={twMerge("h-44 ", className)} {...rest}>
      <div className="flex flex-col gap-4.5">
        <UserSection />

        <MessageOfTheDay />
      </div>
    </HeaderContainer>
  );
}

async function UserSection({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const loggedInUserJsend = await getLoggedInUser();

  const hasError = loggedInUserJsend.status !== "success";

  if (hasError || !loggedInUserJsend.data) {
    // TODO IMPORTANT handle error properly
    return null;
  }

  const loggedInUserData = loggedInUserJsend.data;

  return (
    <section
      className={twMerge("flex items-center justify-between", className)}
      {...rest}
    >
      <div className="flex items-center gap-2.5">
        <figure className="relative size-10.5 overflow-hidden rounded-full">
          <Image
            src={defaultUserPicture}
            alt="Profile Picture"
            className="object-cover"
            fill
          />
        </figure>

        <h2 className="flex flex-col">
          <span className="font-medium text-[12px] text-text-minor-emphasis-app">
            Hola!
          </span>

          <span className="font-semibold text-[16px] ">
            {loggedInUserData.name}!
          </span>
        </h2>
      </div>

      <ButtonNotifications />
    </section>
  );
}

function MessageOfTheDay({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const messages = [
    "Vamos a construir consistencia hoy 💪",
    "Un paso más hacia tu mejor versión 🚀",
    "La confianza se construye día a día 🏗️",
    "Hoy toca reforzar tus cimientos 🌱",
    "El progreso nace de la constancia ⚡",
    "Pequeñas acciones, grandes cambios 🔥",
    "No necesitas perfección, solo continuar ✨",
    "Tu futuro yo te lo agradecerá 💚",
    "Construye hábitos que duren para siempre 🧱",
    "Hazlo simple. Hazlo sostenible 🌿",
    "Cada decisión cuenta, incluso las pequeñas 📈",
    "Hoy es una oportunidad para avanzar 🎯",
    "La disciplina amable también funciona 🤝",
    "Confía en el proceso que estás creando 🌟",
    "Menos presión, más consistencia 🛤️",
    "Estás construyendo algo importante 🏛️",
    "Avanza a tu ritmo, pero sigue adelante 🚶‍♂️",
    "La claridad vence a la perfección 🧭",
    "Los resultados llegan con paciencia 🌅",
    "Tu constancia está creando resultados 💪",
    "Un entrenamiento más. Una victoria más 🏆",
    "Hoy también cuenta para tu progreso 📊",
    "Haz espacio para la persona que quieres ser 🌱",
    "La confianza se gana con pequeñas victorias ✨",
    "No necesitas hacerlo perfecto para avanzar 🌊",
    "Tu esfuerzo de hoy construye el mañana 🏗️",
    "Mantén el rumbo, aunque sea paso a paso 🧭",
    "Sé constante, el resto llegará solo 🌿",
    "Cada repetición fortalece tus cimientos 💚",
  ];

  // No DOT take time into account, just day, month and year
  const todayIndex =
    new Date().getDate() + new Date().getMonth() + new Date().getFullYear();

  const messageOfTheDay = messages[todayIndex % messages.length];

  return (
    <h2 className={twMerge("font-semibold text-[26px]", className)} {...rest}>
      {messageOfTheDay}
    </h2>
  );
}

export default DashboardHeader;
