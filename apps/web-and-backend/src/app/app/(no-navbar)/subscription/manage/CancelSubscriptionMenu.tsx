import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import ButtonActionWeak from "@/app/_ui/buttons/ButtonActionWeak";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import AppHeader from "@/app/_ui/typography/AppHeader";

function CancelSubscriptionMenu({
  show,
  ...props
}: { show: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <MenuFromBottom
      title=""
      show={show}
      className={twMerge("text-center", className)}
      {...rest}
    >
      <figure>TODO ICON</figure>

      <AppHeader className="font-bold">¿Cancelar suscripción?</AppHeader>

      <div className="text-[14px] text-text-minor-emphasis-app font-medium flex flex-col gap-1.5">
        <p>
          Tu suscripción permanecerá activa hasta el final del periodo de
          facturación actual.
        </p>

        <p>
          Perderás acceso a las funciones premium al finalizar el periodo de
          facturación actual el{" "}
          <strong className="font-medium text-text">Aug 31, 2023</strong>.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ButtonAction>Mantener Suscripción</ButtonAction>

        <ButtonActionWeak>Cancelar Suscripción</ButtonActionWeak>
      </div>
    </MenuFromBottom>
  );
}

export default CancelSubscriptionMenu;
