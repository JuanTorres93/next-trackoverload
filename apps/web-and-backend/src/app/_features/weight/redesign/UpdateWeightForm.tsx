import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import Input from "@/app/_ui/user-input/Input";

function UpdateWeightForm({
  show = false,
  ...props
}: { show: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <MenuFromBottom
      title="Actualizar peso"
      show={show}
      className={twMerge("", className)}
      {...rest}
    >
      <form className="flex flex-col gap-6.5" action="">
        <FormLabelInput label="Peso actual" htmlFor="current-weight">
          <Input id="current-weight" placeholder="Introduce tu peso" />
        </FormLabelInput>

        <ButtonAction>Guardar</ButtonAction>
      </form>
    </MenuFromBottom>
  );
}

export default UpdateWeightForm;
