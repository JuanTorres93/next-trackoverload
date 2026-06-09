import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";

function BatchConfirmForm({
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  return (
    <form
      className={twMerge(
        "grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full",
        className,
      )}
      {...rest}
      action=""
    >
      <AppSectionTitle className="text-[14px]">
        Estás a punto de registrar lo siguiente
      </AppSectionTitle>

      <ButtonAction className="self-end">
        Confirmar y registrar comidas
      </ButtonAction>
    </form>
  );
}

export default BatchConfirmForm;
